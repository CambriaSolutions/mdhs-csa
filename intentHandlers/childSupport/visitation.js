const { Suggestion } = require('dialogflow-fulfillment')

/**
 * visitation-root
 */
exports.visitationRoot = async agent => {
  try {
    await agent.add(
      'MDHS does provide limited visitation services through the Mississippi Access and Visitation Program also known as MAV-P. Generally, the services offered through this program to parents who have an existing child support case include assistance with developing visitation agreements, parent education, mediation, and access to pro se documents that assist an individual in representing themselves in court. Services may vary based on funding.'
    )

    await agent.add(
      'MDHS cannot represent parties in establishing visitation or custody rights, and the information provided by me or the MDHS website does not constitute legal advice.'
    )

    await agent.add(
      'Please click on the options below to access pro se information if you are interested in representing yourself in court without an attorney. You may also call the MAV-P hotline at <a href="tel:+18005900818">1-800-590-0818</a> for assistance.'
    )

    await agent.add(new Suggestion('Pro Se Packets'))
    await agent.add(new Suggestion('Petition to cite'))
    await agent.add(new Suggestion('Legal Services'))
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
      'If you have a divorce decree or existing visitation order and you are having problems visiting your child, pro se litigation may be an option for you if you have been unable to resolve these issues with the other parent. If you plan to represent yourself in court without an attorney, you will be responsible for completing and filing all legal forms with the court.'
    )

    await agent.add(
      'Please <a href="https://www.mdhs.ms.gov/wp-content/uploads/2018/09/Petition-to-cite-for-Contempt-Pro-Se-9-18.pdf" target="_blank">click here</a> to download the Petition to Cite for Contempt Packet. You may access “Self-Help” videos <a href="http://www.msatjc.org/self-help-videos" target="_blank">here</a> if you plan to represent yourself without a lawyer.'
    )

    await agent.add(new Suggestion('Pro Se Packets'))
    await agent.add(new Suggestion('Legal Services'))
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
      'If you do not have a divorce decree or court-ordered visitation, pro se litigation may be an option for you. If you would like to represent yourself in court without an attorney, you will be responsible for completing and filing all legal forms with the court.'
    )

    await agent.add(
      'Please <a href="https://www.mdhs.ms.gov/wp-content/uploads/2018/09/Petition-to-Establish-Visitation-Rights-Pro-Se-9-18.pdf" target="_blank">click here</a> to download the Pro Se Information Packet. You may access “Self-Help” videos <a href="http://www.msatjc.org/self-help-videos" target="_blank">here</a> if you plan to represent yourself without a lawyer.'
    )

    await agent.add(new Suggestion('Petition to cite'))
    await agent.add(new Suggestion('Legal Services'))
  } catch (err) {
    console.log(err)
  }
}

/**
 * visitation-legalservices
 */
exports.visitationLegalServices = async agent => {
  try {
    await agent.add(
      'For assistance locating legal resources, please <a href="http://www.msatjc.org/legal-resources" target="_blank">click here</a>. You may also access “Self-Help” videos <a href="http://www.msatjc.org/self-help-videos" target="_blank">here</a> if you are planning to represent yourself in court without a lawyer.'
    )

    await agent.add(new Suggestion('Pro Se Packets'))
    await agent.add(new Suggestion('Petition to cite'))
  } catch (err) {
    console.log(err)
  }
}