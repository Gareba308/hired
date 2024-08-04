import { PropsWithChildren } from "react"
import Navbar from "@/components/Navbar"

const HomeLayout = ({children} : PropsWithChildren)=>{
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}

export default HomeLayout