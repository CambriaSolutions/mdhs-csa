const { Suggestion } = require('dialogflow-fulfillment')

/**
 * visitation-root
 */
exports.visitationRoot = async agent => {
    try {
        await agent.add(
            `Mississippi’s Access and Visitation Program (MAV-P) is designed for noncustodial parents to have access to visit their children as specified in a court order or divorce decree. Assistance with voluntary agreements for visitation schedules is provided to parents who have a child support case.`
        )

        await agent.add(
            `I can provide you information about visitation. What are you looking for?`
        )

        await agent.add(new Suggestion('Pro Se Packets'))
        await agent.add(new Suggestion('Petition to cite'))
    } catch (err) {
        console.log(err)
    }
}

/**
 * visitation-petitiontocite
 */
exports.visitationPetitionToCite = async agent => {
    try {
        await agent.add(
            `If you have a divorce decree or existing visitation, and you have been unable to resolve these issues with the other parent,Pro Se litigation may be for you. If you plan to represent yourself in court, you will be responsible for completing and filing all legal forms with the court.`
        )

        await agent.add(
            `Please <a href="https://www.mdhs.ms.gov/wp-content/uploads/2018/09/Petition-to-cite-for-Contempt-Pro-Se-9-18.pdf" target="_blank">click here</a> to download Petition to Cite Contempt packet`
        )

        await agent.add(new Suggestion('Pro Se Packets'))
    } catch (err) {
        console.log(err)
    }
}

/**
 * visitation-prosepackets
 */
exports.visitationProSePacket = async agent => {
    try {
        await agent.add(
            `The Mississippi Department of Human Services (MDHS) cannot represent either party in establishing visitation or custody rights. Pro se litigation may be an option for you which means you will represent yourself in court without the assistance of an attorney.`
        )

        await agent.add(
            `Please <a href="https://www.mdhs.ms.gov/wp-content/uploads/2018/09/Petition-to-Establish-Visitation-Rights-Pro-Se-9-18.pdf" target="_blank">click here</a> to download the Pro Se information Packet`
        )

        await agent.add(new Suggestion('Petition to cite'))
    } catch (err) {
        console.log(err)
    }
}