import Image from "next/image";
import Link from "next/link";

const MobileLogo = () => {
  return (
    <>
      <Link href="/control" className="rounded-sm">
        <Image
          src={
            "https://res.cloudinary.com/dx0i37cyd/image/upload/v1722608373/Hired-_Kenya_3_tyegve.png"
          }
          height={55}
          width={60}
          alt="Logo"
          title="Logo"
          quality={100}
          className="rounded-sm"
          priority={true}
        />
      </Link>
    </>
  );
};

export default MobileLogo;
