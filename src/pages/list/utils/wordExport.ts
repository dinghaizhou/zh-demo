import { marked } from 'marked';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';

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
  
  tokens.forEach((token) => {
    switch (token.type) {
      case 'heading':
        const headingLevel = token.depth as number;
        let headingType: any;
        switch (headingLevel) {
          case 1:
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
            text: token.text,
            heading: headingType,
            spacing: {
              after: 200,
              before: token.depth === 1 ? 400 : 200
            }
          })
        );
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
          const headerCells = token.header.map((cell: string) => {
            const cellTextRuns = parseInlineFormatting(cell.text);
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
        token.rows.forEach((row: string[]) => {
          const cells = row.map((cell: string) => {
            const cellTextRuns = parseInlineFormatting(cell.text);
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
  console.log('text', text)
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
  const lines = text.split('\n');
  
  lines.forEach((line, index) => {
    if (index > 0) {
      // 添加换行符
      textRuns.push(
        new TextRun({
          text: '',
          break: 1,
          alignment: AlignmentType.LEFT,
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
    // 创建Word文档
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // 文档标题
          new Paragraph({
            text: projectInfo?.projectName || projectName,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
              before: 200
            }
          }),
          
          // 项目信息（如果有）
          // ...(projectInfo ? [
          //   new Paragraph({
          //     children: [
          //       new TextRun({
          //         text: '项目信息',
          //         bold: true,
          //         size: 24
          //       })
          //     ],
          //     heading: HeadingLevel.HEADING_2,
          //     spacing: {
          //       after: 200,
          //       before: 400
          //     }
          //   }),
          //   new Paragraph({
          //     children: [
          //       new TextRun({
          //         text: `项目名称：${projectInfo.projectName || ''}`,
          //         size: 20
          //       })
          //     ],
          //     spacing: { after: 100 }
          //   }),
          //   new Paragraph({
          //     children: [
          //       new TextRun({
          //         text: `采购单位：${projectInfo.procurementUnit || ''}`,
          //         size: 20
          //       })
          //     ],
          //     spacing: { after: 100 }
          //   }),
          //   new Paragraph({
          //     children: [
          //       new TextRun({
          //         text: `服务期限：${projectInfo.servicePeriod || ''}`,
          //         size: 20
          //       })
          //     ],
          //     spacing: { after: 100 }
          //   }),
          //   new Paragraph({
          //     children: [
          //       new TextRun({
          //         text: `服务地点：${projectInfo.serviceLocation || ''}`,
          //         size: 20
          //       })
          //     ],
          //     spacing: { after: 200 }
          //   }),
          //   new Paragraph({
          //     children: [
          //       new TextRun({
          //         text: '文档内容',
          //         bold: true,
          //         size: 24
          //       })
          //     ],
          //     heading: HeadingLevel.HEADING_2,
          //     spacing: {
          //       after: 200,
          //       before: 400
          //     }
          //   })
          // ] : []),
          
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