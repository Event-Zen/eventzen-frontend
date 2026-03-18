import Footer from "../components/Footer";
import Header from "../components/Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;