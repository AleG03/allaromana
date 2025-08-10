export function isNonEmpty(str: string, max = 200): boolean {
    const s = str.trim();
    return s.length > 0 && s.length <= max;
  }
  
  export function isValidAmount(input: string): boolean {

    return /^[0-9]+([.,][0-9]{1,2})?$/.test(input.trim());
  }
  
  export function isValidISODate(input: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return false;
    const d = new Date(input);
    return !isNaN(d.getTime());
  }