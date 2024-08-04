import Link from 'next/link'
import { Button } from '@/components/ui/button'
import UserAccountNav from './UserAccountNav'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { db } from '@/db'

const DashNavbarRoutes = async () => {

  const session= await getServerSession(authOptions)

  if(!session) redirect('/home/login')

  const userId= session.id

  const user= await db.user.findFirst({
    where: {
      id: userId
    }
  })

  if(!user) redirect('/home/login')

  const email = user.email as string
  const imageUrl= user.image as string
  const name= user.name as string

  return (
    <div className='flex gap-x-3 ml-auto'>
        <Link href='/manage/services'>
            <Button size='sm' variant='ghost' className=''>Services</Button>
        </Link>
        
        <UserAccountNav email={email} imageUrl={imageUrl} name={name}/>
    </div>
  )
}

export default DashNavbarRoutes