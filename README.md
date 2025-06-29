# Tecknion Architects Website

## Setup Instructions

### XAMPP Setup for Contact Form

1. **Install XAMPP**
   - Download and install XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
   - During installation, make sure to select at least Apache, MySQL, and PHP components

2. **Start XAMPP Services**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services by clicking the "Start" buttons next to them
   - Make sure both services show a green background, indicating they're running

3. **Copy Website Files**
   - Copy all the website files to the XAMPP htdocs folder:
     - Windows: `C:\xampp\htdocs\tecknion`
     - Mac: `/Applications/XAMPP/htdocs/tecknion`
     - Linux: `/opt/lampp/htdocs/tecknion`

4. **Access the Website**
   - Open your browser and go to: `http://localhost/tecknion/home.html`

### Database Setup

The database will be created automatically when the first form is submitted. However, you can also set it up manually:

1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click on "New" in the left sidebar
3. Enter "tecknion_db" as the database name and click "Create"
4. Select the new database from the left sidebar
5. Click on the "SQL" tab
6. Paste the following SQL code and click "Go":

```sql
CREATE TABLE contacts (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    date_submitted DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT
);
```

### Viewing Form Submissions

1. Start XAMPP services (Apache and MySQL)
2. Open your browser and go to: `http://localhost/tecknion/view_submissions.php`
3. Enter the password: `tecknion2025` (you can change this in the view_submissions.php file)

### Troubleshooting

- **Port Conflicts**: If Apache or MySQL won't start, it might be due to port conflicts. You can change the ports in the XAMPP Control Panel by clicking "Config" next to the service.
- **Permission Issues**: Make sure XAMPP has proper permissions to read/write to the htdocs folder.
- **PHP Mail Function**: The contact form uses PHP's mail function. On Windows, this requires additional configuration:
  1. Open `C:\xampp\php\php.ini`
  2. Find the [mail function] section
  3. Set `SMTP = localhost` and `smtp_port = 25`
  4. Alternatively, use a service like SendGrid or Mailgun for more reliable email delivery

### Security Notes

- The view_submissions.php file has a simple password protection. For production, consider implementing stronger authentication.
- Before deploying to a live server, review the database connection settings and security measures.
- Consider implementing CAPTCHA to prevent spam submissions.

## Website Features

- Responsive design for all devices
- Interactive portfolio with project details
- Contact form with database storage
- Virtual assistant for user queries
- Social media integration
- Modern, professional aesthetics

## Credits

- Design & Development: M.S.ABBAS, Jayanth Mayur
- Framework: Custom HTML, CSS, JavaScript
- Icons: Font Awesome
- Fonts: EB Garamond, Satoshi