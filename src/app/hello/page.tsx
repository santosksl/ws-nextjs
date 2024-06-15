import Link from "next/link"

export default function HelloWorld() {
    return (
        <>
            Hello, World
            <button>
                <Link href="/test">Click</Link>
            </button>
        </>
    )
}