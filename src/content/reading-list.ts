// Cover sources: Open Library IDs 12318698 and 15272628, and Penguin Random House ISBN 9780804139298.
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
] as const
