import Image from "next/image";
import Link from "next/link";

const MobileLogo = () => {
  return (
    <>
      <Link href="/manage">
        <Image
          src={
            "https://res.cloudinary.com/dx0i37cyd/image/upload/v1723627737/veryHired_lo5n1w.png"
          }
          height={55}
          width={65}
          alt="Logo"
          title="Logo"
          quality={100}
          className="rounded-sm md:hidden"
          priority={true}
        />
        <h2 className="font-bold text-4xl tracking-tighter hidden md:flex text-gray-700">
          hired.co.ke
        </h2>
      </Link>
    </>
  );
};

export default MobileLogo;
