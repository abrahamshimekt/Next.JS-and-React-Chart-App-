import '../globals.css';
export const metadata = {
  title: '404 – Page Not found',
  description: '404 – Not found',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
