import { marked } from 'marked';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, PageBreak, Bookmark, PageReference, InternalHyperlink } from 'docx';

// 配置marked选项
marked.setOptions({
  gfm: true, // 启用GitHub Flavored Markdown
  breaks: true, // 将换行符转换为<br>
});

// 解析markdown内容为Word文档结构
const parseMarkdownToWordElements = (markdown: string) => {
  const elements: any[] = [];
  
  // 使用marked解析markdown
  const tokens = marked.lexer(markdown);
  let headingIndex = 1;
  
  tokens.forEach((token) => {
    switch (token.type) {
      case 'heading':
        const headingLevel = token.depth as number;
        let headingType: any;
        switch (headingLevel) {
          case 1:
            console.log('token', token)
            headingType = HeadingLevel.HEADING_1;
            break;
          case 2:
            headingType = HeadingLevel.HEADING_2;
            break;
          case 3:
            headingType = HeadingLevel.HEADING_3;
            break;
          case 4:
            headingType = HeadingLevel.HEADING_4;
            break;
          case 5:
            headingType = HeadingLevel.HEADING_5;
            break;
          case 6:
            headingType = HeadingLevel.HEADING_6;
            break;
          default:
            headingType = HeadingLevel.HEADING_1;
        }
        elements.push(
          new Paragraph({
            children: [
              new Bookmark({
                id: `section${headingIndex}`,
                children: [
                  new TextRun({
                    text: token.text,
                  })
                ]
              })
            ],
            heading: headingType,
            spacing: {
              after: 200,
              before: token.depth === 1 ? 400 : 200
            },
          })
        );
        headingIndex++;
        break;
        
      case 'paragraph':
        // 处理段落中的加粗、斜体等内联格式
        const textRuns = parseInlineFormatting(token.text);
        elements.push(
          new Paragraph({
            children: textRuns,
            spacing: { after: 200 },
            alignment: AlignmentType.LEFT,
          })
        );
        break;
        
      case 'table':
        const tableRows: TableRow[] = [];
        
        // 处理表头
        if (token.header) {
          const headerCells = token.header.map((cell: any) => {
            const cellTextRuns = parseInlineFormatting(cell.text || cell);
            return new TableCell({
              children: [
                new Paragraph({
                  children: cellTextRuns
                })
              ],
              width: {
                size: 100 / token.header.length,
                type: WidthType.PERCENTAGE
              }
            });
          });
          tableRows.push(new TableRow({ children: headerCells }));
        }
        
        // 处理表格数据
        token.rows.forEach((row: any[]) => {
          const cells = row.map((cell: any) => {
            const cellTextRuns = parseInlineFormatting(cell.text || cell);
            return new TableCell({
              children: [
                new Paragraph({
                  children: cellTextRuns,
                  alignment: AlignmentType.LEFT,
                })
              ],
              width: {
                size: 100 / row.length,
                type: WidthType.PERCENTAGE
              }
            });
          });
          tableRows.push(new TableRow({ children: cells }));
        });
        
        elements.push(
          new Table({
            rows: tableRows,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            }
          })
        );
        break;
        
      case 'list':
        token.items.forEach((item: any) => {
          const itemTextRuns = parseInlineFormatting(item.text);
          elements.push(
            new Paragraph({
              children: [
                // new TextRun({
                //   text: `${token.ordered ? '1.' : '•'} `,
                //   size: 20
                // }),
                ...itemTextRuns
              ],
              spacing: { after: 100 },
              alignment: AlignmentType.LEFT,
              // bullet: token.ordered ? undefined : { level: 0 }
            })
          );
        });
        break;
        
      case 'code':
        // 处理代码块中的换行符
        const codeLines = token.text.split('\n');
        const codeTextRuns: TextRun[] = [];
        
        codeLines.forEach((line: string, index: number) => {
          if (index > 0) {
            // 添加换行符
            codeTextRuns.push(
              new TextRun({
                text: '',
                break: 1
              })
            );
          }
          
          if (line) {
            codeTextRuns.push(
              new TextRun({
                text: line,
                size: 18,
                font: 'Courier New'
              })
            );
          }
        });
        
        elements.push(
          new Paragraph({
            children: codeTextRuns,
            spacing: { after: 200 }
          })
        );
        break;
        
      case 'blockquote':
        const quoteTextRuns = parseInlineFormatting(token.text);
        elements.push(
          new Paragraph({
            children: quoteTextRuns,
            spacing: { after: 200 },
            indent: { left: 720 } // 0.5 inch
          })
        );
        break;
        
      case 'hr':
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '─'.repeat(50),
                size: 20,
                color: 'CCCCCC'
              })
            ],
            spacing: { after: 200 }
          })
        );
        break;
        
      default:
        // 对于其他类型的token，转换为普通段落
        if ('text' in token && token.text) {
          const textRuns = parseInlineFormatting(token.text);
          elements.push(
            new Paragraph({
              children: textRuns,
              spacing: { after: 200 }
            })
          );
        }
        break;
    }
  });
  
  return elements;
};

// 解析内联格式（加粗、斜体等）
export const parseInlineFormatting = (text: string): TextRun[] => {
  const textRuns: TextRun[] = [];
  let currentIndex = 0;
  
  // 匹配加粗语法 **text** 或 __text__
  const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // 添加加粗前的普通文本
    if (match.index > currentIndex) {
      const plainText = text.slice(currentIndex, match.index);
      // 处理普通文本中的换行符
      const plainTextRuns = handleLineBreaks(plainText);
      textRuns.push(...plainTextRuns);
    }
    
    // 添加加粗文本
    const boldText = match[1] || match[2]; // 匹配第一个或第二个捕获组
    // 处理加粗文本中的换行符
    const boldTextRuns = handleLineBreaks(boldText, true);
    textRuns.push(...boldTextRuns);
    
    currentIndex = match.index + match[0].length;
  }
  
  // 添加剩余的普通文本
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex);
    // 处理剩余文本中的换行符
    const remainingTextRuns = handleLineBreaks(remainingText);
    textRuns.push(...remainingTextRuns);
  }
  
  // 如果没有找到任何加粗语法，返回普通文本
  if (textRuns.length === 0) {
    const plainTextRuns = handleLineBreaks(text);
    textRuns.push(...plainTextRuns);
  }
  
  return textRuns;
};

// 处理文本中的换行符
export const handleLineBreaks = (text: string, isBold: boolean = false): TextRun[] => {
  const textRuns: TextRun[] = [];
  if (!text || typeof text !== 'string') return textRuns;
  const lines = text?.split('\n');
  
  lines.forEach((line, index) => {
    if (index > 0) {
      // 添加换行符
      textRuns.push(
        new TextRun({
          text: '',
          break: 1,
        })
      );
    }
    
    if (line) {
      textRuns.push(
        new TextRun({
          text: line,
          size: 20,
          bold: isBold
        })
      );
    }
  });
  
  return textRuns;
};

// 创建封面
const createCoverPage = (projectInfo?: {
  projectName?: string;
  procurementUnit?: string;
  servicePeriod?: string;
  serviceLocation?: string;
}) => {
  const currentDate = new Date().toLocaleDateString('zh-CN');
  
  return [
    // 顶部空白
    new Paragraph({
      children: [
        new TextRun({
          text: '',
        })
      ],
      spacing: { before: 600 }
    }),
    
    // 标题
    new Paragraph({
      children: [
        new TextRun({
          text: projectInfo?.projectName || '采购项目文档',
          bold: true,
          size: 36,
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 2000,
        before: 200
      }
    }),
    
    // 项目信息表格
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '项目名称',
                      bold: true,
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.CENTER
                })
              ],
              width: { size: 30, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: projectInfo?.projectName || '',
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.LEFT
                })
              ],
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '采购单位',
                      bold: true,
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.CENTER
                })
              ],
              width: { size: 30, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: projectInfo?.procurementUnit || '',
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.LEFT
                })
              ],
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '服务期限',
                      bold: true,
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.CENTER
                })
              ],
              width: { size: 30, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: projectInfo?.servicePeriod || '',
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.LEFT
                })
              ],
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '服务地点',
                      bold: true,
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.CENTER
                })
              ],
              width: { size: 30, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: projectInfo?.serviceLocation || '',
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.LEFT
                })
              ],
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '生成日期',
                      bold: true,
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.CENTER
                })
              ],
              width: { size: 30, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: currentDate,
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.LEFT
                })
              ],
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 }
            })
          ]
        })
      ],
      width: { size: 80, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      margins: { top: 800, bottom: 400, left: 400, right: 400 }
    }),
    
    // 底部空白
    new Paragraph({
      children: [
        new TextRun({
          text: '',
        })
      ],
      spacing: { after: 800 }
    }),
    
    // 分页符
    new Paragraph({
      children: [
        new TextRun({
          text: '',
          break: 1
        })
      ],
      spacing: { after: 200 }
    })
  ];
};

// 创建目录
const createTableOfContents = (markdown: string) => {
  const elements: any[] = [];
  
  // 目录标题
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '目录',
          bold: true,
          size: 24
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 300,
        before: 200
      },
      pageBreakBefore: true,
    })
  );
  
  // 解析markdown获取标题
  const tokens = marked.lexer(markdown);
  let headingIndex = 1;
  
  tokens.forEach((token) => {
    if (token.type === 'heading') {
      // 根据标题深度添加缩进
      const indent = (token.depth - 1) * 20;
      
      elements.push(
        new Paragraph({
          children: [
            new InternalHyperlink({
              children: [
                new TextRun({
                  text: `${token.text}`,
                  size: 20,
                  color: '0563C1',
                  underline: {}
                })
              ],
              anchor: `section${headingIndex}`
            })
          ],
          spacing: { after: 100 },
          indent: { left: indent }
        })
      );
      
      headingIndex++;
    }
  });
  
  return elements;
};

// 导出markdown为Word文档
export const exportMarkdownToWord = async (
  markdown: string, 
  projectName: string = '采购文档',
  projectInfo?: {
    projectName?: string;
    procurementUnit?: string;
    servicePeriod?: string;
    serviceLocation?: string;
  }
) => {
  try {
    // 创建封面
    const coverPage = createCoverPage(projectInfo);
    
    // 创建目录
    const tableOfContents = createTableOfContents(markdown);
    
    // 创建Word文档
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // 封面
          ...coverPage,
          
          // 目录
          ...tableOfContents,
          
          // 文档标题
          new Paragraph({
            children: [
              new Bookmark({
                id: "section1",
                children: [
                  new TextRun({
                    text: projectInfo?.projectName || projectName,
                  })
                ]
              })
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
              before: 200
            },
            pageBreakBefore: true,
          }),
          
          // 解析markdown内容
          ...parseMarkdownToWordElements(markdown)
        ]
      }]
    });

    // 生成Word文档
    const blob = await Packer.toBlob(doc);
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName}_${new Date().toISOString().slice(0, 10)}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('导出Word文档失败:', error);
    throw error;
  }
};

// 将markdown转换为HTML（用于预览）
export const markdownToHtml = (markdown: string): string => {
  return marked.parse(markdown) as string;
};

// 将markdown转换为纯文本
export const markdownToText = (markdown: string): string => {
  // 使用marked解析，然后提取纯文本
  const tokens = marked.lexer(markdown);
  const textParts: string[] = [];
  
  tokens.forEach((token) => {
    switch (token.type) {
      case 'heading':
      case 'paragraph':
      case 'text':
        textParts.push(token.text);
        break;
      case 'table':
        // 处理表格
        if (token.header) {
          textParts.push(token.header.join(' | '));
        }
        token.rows.forEach((row: string[]) => {
          textParts.push(row.join(' | '));
        });
        break;
      case 'list':
        token.items.forEach((item: any) => {
          textParts.push(item.text);
        });
        break;
      case 'code':
        textParts.push(token.text);
        break;
      case 'blockquote':
        textParts.push(token.text);
        break;
      default:
        if ('text' in token && token.text) {
          textParts.push(token.text);
        }
        break;
    }
  });
  
  return textParts.join('\n');
};


export const exportHtmlToWord = async (content: string, fileName: string) => {
  const html = markdownToHtml(content);
    
    const wordDocument = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Markdown to Word</title></head>
        <body>${html}</body>
        </html>
    `;

    const blob = new Blob([wordDocument], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".doc";
    link.click();
    URL.revokeObjectURL(link.href);

}; 