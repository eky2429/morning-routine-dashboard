export const tags = [
    "🙏 Spiritual",
    "💪 Physical",
    "🧠 Intellectual",
    "💼 Occupational",
    "👥 Social",
    "🌍 Environmental",
    "❤️ Emotional",
    "💰 Financial",

    //"🎨 Creativity",
    //"❤️ Relationships",
    //"📚 Education",
    //"🌍 Travel",
    //"🍎 Nutrition",
    //"🧠 Mental",
    //"📊 Productivity",
    
    "📌 Other",
]

// Function to get emoji based on index (integer)
export function getEmoji(index){
    return tags[index].split(" ")[0];
}

//Function to get text based on index (integer)
export function getText(index){
    return tags[index].split(" ")[1];
}