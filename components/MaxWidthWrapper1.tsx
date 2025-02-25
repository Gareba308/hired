import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const MaxWidthWrapper1 = ({
    className,
    children
} : {
    className?: String
    children: ReactNode
})=>{
    return (
        <div className={cn('mx-auto w-full max-w-screen-xl md:px-8', className)}>
            {children}
        </div>
    )
}

export default MaxWidthWrapper1