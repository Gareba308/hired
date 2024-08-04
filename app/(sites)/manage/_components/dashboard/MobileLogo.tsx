import Image from "next/image";
import Link from "next/link";

const MobileLogo = () => {
  return (
    <>
      <Link href="/site" className="md:hidden rounded-md">
        <Image
          src={
            "https://res.cloudinary.com/dx0i37cyd/image/upload/v1722608373/Hired-_Kenya_3_tyegve.png"
          }
          height={58}
          width={58}
          alt="Logo"
          title="Logo"
          quality={100}
          className="rounded-md"
          priority={true}
        />
      </Link>
    </>
  );
};

export default MobileLogo;
