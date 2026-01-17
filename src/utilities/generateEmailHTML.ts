import { getServerSideURL } from './getURL'

interface EmailData {
  headline: string
  content: string
  cta?: {
    label: string
    url: string
  }
}

export const generateEmailHTML = (data: EmailData): string => {
  const primaryRed = '#C90E1D'
  const logoURL = `${getServerSideURL()}/media/logo.png`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.headline}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ffffff;
            padding: 20px;
            text-align: center;
            border-bottom: 2px solid ${primaryRed};
        }
        .header h1 {
            color: ${primaryRed};
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
            line-height: 1.6;
        }
        .content h2 {
            color: #333;
            margin-top: 0;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eeeeee;
        }
        .btn {
            display: inline-block;
            background-color: ${primaryRed};
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            margin-top: 20px;
            font-weight: bold;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .info-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .info-table td:first-child {
            font-weight: bold;
            width: 30%;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Ideally we use a real hosted logo URL here. For now using text or a placeholder if the server URL is public -->
            <h1>Code 3</h1>
        </div>
        <div class="content">
            ${data.content}
            ${data.cta ? `<a href="${data.cta.url}" class="btn">${data.cta.label}</a>` : ''}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Code 3. All rights reserved.</p>
            <p>If you have any questions, please contact us at <a href="mailto:enquiries@code3.ae" style="color: ${primaryRed}; text-decoration: none;">enquiries@code3.ae</a></p>
        </div>
    </div>
</body>
</html>
  `
}
