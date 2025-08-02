import { parseInlineFormatting, handleLineBreaks } from './wordExport';

// 测试换行符处理
describe('Word Export - Line Break Handling', () => {
  test('should handle simple line breaks', () => {
    const text = 'Line 1\nLine 2\nLine 3';
    const result = handleLineBreaks(text);
    
    expect(result).toHaveLength(5); // 3 text runs + 2 break runs
    expect(result[0].text).toBe('Line 1');
    expect(result[1].break).toBe(1);
    expect(result[2].text).toBe('Line 2');
    expect(result[3].break).toBe(1);
    expect(result[4].text).toBe('Line 3');
  });

  test('should handle line breaks with bold text', () => {
    const text = '**Bold Line 1**\n**Bold Line 2**';
    const result = parseInlineFormatting(text);
    
    // 应该包含换行符和加粗文本
    expect(result.length).toBeGreaterThan(2);
  });

  test('should handle empty lines', () => {
    const text = 'Line 1\n\nLine 3';
    const result = handleLineBreaks(text);
    
    expect(result).toHaveLength(5); // 2 text runs + 2 break runs + 1 empty text run
  });

  test('should handle text without line breaks', () => {
    const text = 'Simple text without breaks';
    const result = handleLineBreaks(text);
    
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Simple text without breaks');
  });
}); 