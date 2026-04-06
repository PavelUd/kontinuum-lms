namespace Users.Application.Helpers;

public static class PhoneHelper
{
    public static string NormalizePhone(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            throw new ArgumentException("Телефон пустой");
        
        var digits = new string(phone.Where(char.IsDigit).ToArray());
        
        if (digits.Length == 11 && digits.StartsWith("8"))
        {
            digits = "7" + digits.Substring(1);
        }
        
        if (digits.Length != 11 || !digits.StartsWith("7"))
        {
            throw new ArgumentException("Некорректный номер телефона");
        }
        
        return "+" + digits;
    }
}