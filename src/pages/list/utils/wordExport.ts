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
    console.log(tokens)
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
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: token.text,
                size: 20
              })
            ],
            spacing: { after: 200 }
          })
        );
        break;
        
      case 'table':
        const tableRows: TableRow[] = [];
        
        // 处理表头
        if (token.header) {
          const headerCells = token.header.map((cell: string) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      bold: true,
                      size: 20
                    })
                  ]
                })
              ],
              width: {
                size: 100 / token.header.length,
                type: WidthType.PERCENTAGE
              }
            })
          );
          tableRows.push(new TableRow({ children: headerCells }));
        }
        
        // 处理表格数据
        token.rows.forEach((row: string[]) => {
          const cells = row.map((cell: string) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      size: 20
                    })
                  ]
                })
              ],
              width: {
                size: 100 / row.length,
                type: WidthType.PERCENTAGE
              }
            })
          );
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
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${token.ordered ? '1.' : '•'} ${item.text}`,
                  size: 20
                })
              ],
              spacing: { after: 100 },
              bullet: token.ordered ? undefined : { level: 0 }
            })
          );
        });
        break;
        
      case 'code':
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: token.text,
                size: 18,
                font: 'Courier New'
              })
            ],
            spacing: { after: 200 }
          })
        );
        break;
        
      case 'blockquote':
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: token.text,
                size: 20,
                color: '666666'
              })
            ],
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
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: token.text,
                  size: 20
                })
              ],
              spacing: { after: 200 }
            })
          );
        }
        break;
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
          ...(projectInfo ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: '项目信息',
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: {
                after: 200,
                before: 400
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `项目名称：${projectInfo.projectName || ''}`,
                  size: 20
                })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `采购单位：${projectInfo.procurementUnit || ''}`,
                  size: 20
                })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `服务期限：${projectInfo.servicePeriod || ''}`,
                  size: 20
                })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `服务地点：${projectInfo.serviceLocation || ''}`,
                  size: 20
                })
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '文档内容',
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: {
                after: 200,
                before: 400
              }
            })
          ] : []),
          
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