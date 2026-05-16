import { Header } from '../components/Header'

export const FeatureLayout = ({children}) => {
    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
            <Header />
            <main className="flex-1 bg-olive-950 overflow-x-hidden w-full min-w-0">
                {children}
            </main>
        </div>
    )
}