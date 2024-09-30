import ConnectButton from "@/components/ConnectButton";
import Header from "@/components/Header";
import HomeContainer from "@/containers/HomeContainer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-[#1c1b1b] gap-2">
      <Header />
      <HomeContainer />
    </main>
  );
}
