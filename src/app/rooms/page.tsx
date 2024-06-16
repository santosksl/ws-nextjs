import Chat from "@/components/layout/body/Chat"

interface Request {
    searchParams: {
        id: number
    }
}
export default function Page({ searchParams }: Request) {
    return (
        <div className="w-[100vw] h-[100vh]">
            <Chat />
        </div>
    )
}