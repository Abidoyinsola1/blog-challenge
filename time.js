module.exports.estimatedTime = (numOfWords) => {
    const wordsPerMinute = 200
    const averageEstimatedTime = Math.round(numOfWords/wordsPerMinute)
    return averageEstimatedTime
}
