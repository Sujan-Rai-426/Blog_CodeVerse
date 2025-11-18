# utils.py
import smtplib
import dns.resolver

def verify_email_exists(email, timeout=10):
    """
    Verify if an email exists using MX records and SMTP RCPT command.
    Returns True if the email exists, False otherwise.
    """
    # Extract domain
    try:
        domain = email.split('@')[1]
    except IndexError:
        return False  # Invalid email format

    # Resolve MX records
    try:
        records = dns.resolver.resolve(domain, 'MX')
    except Exception:
        return False

    # Check email via SMTP
    try:
        return _check_smtp(records, email, timeout)
    except Exception:
        return False


def _check_smtp(records, email, timeout=10):
    """
    Helper function to check SMTP RCPT response.
    """
    smtp = smtplib.SMTP(timeout=timeout)
    smtp.connect(records[0].exchange.to_text())
    smtp.helo()
    smtp.mail('')
    code, _ = smtp.rcpt(email)
    smtp.quit()
    return code == 250
