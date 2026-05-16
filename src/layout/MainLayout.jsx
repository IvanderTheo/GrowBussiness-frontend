import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const MainLayout = ({children}) => {
    return (
        <>
        <Header/>
        <main className="min-h-screen bg-olive-950">{children}</main>
        <Footer/>
        </>
    )
}