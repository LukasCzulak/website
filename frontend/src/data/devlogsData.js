export const devlogs = [
    { 
        id: 0, 
        date: "21.03.2026", 
        title: "Step 0: The Goal", 
        content: "My motivation for this project is simple: I want to see if I am capable of writing code that can correctly calculate the result of 123456789^123456789. I had this idea about a year ago when I started learning C++ and it quickly became an interesting adventure! What I thought was a simple challenge turned out to be quite hard. This however isn't just a standard math problem: the result has 998.952.458 digits and takes up roughly 415 MB of RAM just to store in binary. Calculating this in human time is going to require some serious algorithmic optimization." 
    },
    { 
        id: 1, 
        date: "27.03.2026", 
        title: "Step 1: The Setup", 
        content: "When I started the challenge about a year ago, I wasn't really prepared for anything and simply began writing code until I came to the point of having basically no structure: 11+ versions, messy code, no tests, ...This time, I am better prepared. I chose to spent some time on the setup, including CMake for modern build management, Google Test for a better testing structure and a strict .clang-format to keep the codebase professional."
    },
    {
        id: 2,
        date: "31.03.2026", 
        title: "Step 2: The Base-10 Foundation", 
        content: "Instead of jumping straight into complex 64-bit bitwise operations, I decided to start with a 'Base-10' architecture using a std::vector<uint8_t>. By storing one decimal digit per array slot, I was able to implement addition and multiplication exactly like grade-school math. It might not be the most memory-efficient approach yet, but it allowed me to perfectly map out my logic, handle edge cases like carry rollovers, and write a comprehensive Google Test suite to guarantee my math is actually correct. Now that I have a reliable, fully-tested baseline, the next phase is to build the Lexer and Parser so the program can actually read math expressions."
    },
];
