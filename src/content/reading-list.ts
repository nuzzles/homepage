// Cover sources: Open Library IDs 12318698 and 15272628, and Penguin Random House ISBN 9780804139298.
// Added covers: Open Library IDs 13168046 and 91081; ISBN 9781593278281 (first edition).
// NASA covers: https://www.nasa.gov/ebooks/the-international-space-station-operating-an-outpost-in-the-new-frontier/
// and the PDF linked from https://www.nasa.gov/reference/systems-engineering-handbook/.
// Keep only years and books Spencer has confirmed; omit unprovided ratings and completion dates.
export const readingList = [
    {
        year: 2026,
        books: [
            { title: "Zero to One", author: "Peter Thiel with Blake Masters", cover: "/images/books/zero-to-one.jpg" },
        ],
    },
    {
        year: 2025,
        books: [
            {
                title: "The 7 Habits of Highly Effective People",
                author: "Stephen R. Covey",
                cover: "/images/books/seven-habits.jpg",
            },
        ],
    },
    {
        year: 2023,
        books: [
            {
                title: "Software Architecture: The Hard Parts",
                author: "Neal Ford, Mark Richards, Pramod Sadalage, and Zhamak Dehghani",
                cover: "/images/books/software-architecture.jpg",
            },
        ],
    },
    {
        year: 2021,
        books: [
            {
                title: "Rust for Rustaceans",
                author: "Jon Gjengset",
                cover: "/images/books/rust-for-rustaceans.jpg",
            },
            {
                title: "NASA Systems Engineering Handbook",
                author: "NASA",
                cover: "/images/books/nasa-systems-engineering.jpg",
            },
            {
                title: "The International Space Station: Operating an Outpost in the New Frontier",
                author: "Robert Dempsey, executive editor",
                cover: "/images/books/international-space-station.jpg",
            },
        ],
    },
    {
        year: 2019,
        books: [
            {
                title: "Agile Software Development: Principles, Patterns, and Practices",
                author: "Robert C. Martin",
                cover: "/images/books/agile-software-development.jpg",
            },
        ],
    },
    {
        year: 2018,
        books: [
            {
                title: "The Rust Programming Language (1st edition)",
                author: "Steve Klabnik and Carol Nichols",
                cover: "/images/books/rust-programming-language.jpg",
            },
        ],
    },
] as const
