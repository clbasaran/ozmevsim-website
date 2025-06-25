export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('🚪 LOGIN LAYOUT - Overriding admin layout');
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 