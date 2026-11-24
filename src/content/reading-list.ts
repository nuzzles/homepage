// Keep only years and books Spencer has confirmed; omit unprovided ratings and completion dates.
export const readingList = [
    { year: 2026, books: [{ title: "Zero to One", author: "Peter Thiel with Blake Masters" }] },
    { year: 2025, books: [{ title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey" }] },
    {
        year: 2023,
        books: [
            {
                title: "Software Architecture: The Hard Parts",
                author: "Neal Ford, Mark Richards, Pramod Sadalage, and Zhamak Dehghani",
            },
        ],
    },
] as const
