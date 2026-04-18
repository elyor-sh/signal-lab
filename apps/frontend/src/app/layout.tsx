import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Signal Lab',
  description: 'Observability playground for scenario runs',
};

const criticalCss = `
body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(239, 68, 68, 0.06) 45%, rgba(14, 165, 233, 0.08)), #f8fafc;
  color: #172033;
}
main {
  min-height: 100vh;
  padding: 24px 16px;
}
main > div {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
header,
section > div {
  border: 1px solid #d5dce5;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
}
header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
}
h1,
h2,
p {
  margin-top: 0;
}
h1 {
  margin-bottom: 8px;
  font-size: 30px;
  line-height: 1.15;
}
h2 {
  margin-bottom: 6px;
  font-size: 18px;
}
section {
  display: grid;
  gap: 24px;
}
section > div > div:first-child {
  padding: 20px 20px 8px;
}
section > div > div:last-child {
  padding: 12px 20px 20px;
}
form > label {
  display: block;
  margin-bottom: 16px;
}
label > span {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}
input,
[role="combobox"] {
  width: 100%;
  min-height: 40px;
  border: 1px solid #d5dce5;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px 12px;
  font: inherit;
}
button[type="submit"] {
  width: 100%;
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  background: #128774;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
a {
  color: inherit;
}
section a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #d5dce5;
  border-radius: 8px;
  background: #ffffff;
  padding: 10px 12px;
  font-weight: 600;
  text-decoration: none;
}
code {
  display: block;
  overflow-wrap: anywhere;
  font-size: 12px;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
}
th,
td {
  padding: 10px 12px;
  border-top: 1px solid #d5dce5;
  text-align: left;
  font-size: 14px;
}
thead th {
  background: #f1f5f9;
  color: #64748b;
}
@media (min-width: 640px) {
  header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}
@media (min-width: 1024px) {
  section {
    grid-template-columns: minmax(0, 420px) minmax(0, 1fr) minmax(260px, 320px);
  }
}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        <Providers>{children}</Providers>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
