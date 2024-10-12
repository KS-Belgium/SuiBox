
# ZKBox

A security system for hotel safes built with Sui Technology


![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


## Demo

Insert gif or link to demo


## Authors

- [Yassine](https://github.com/Yionidas)
- [Lorenzo](https://github.com/LorenzoLepoivre/LorenzoLepoivre)
- [William](https://github.com/WillHCode)



## Features

- Giving unique access to the safe for customer
- Accessing with a NFC badge
- User renting management


## Tech Stack

**Front-end:** React, Tailwind

**Back-end:** Sui Move, Python, C++ (arduino)


## Alice and Bob's Problem

When we arrived at this hackathon, our team was energized and eager to leverage blockchain technology to create something transformative. After extensive brainstorming, we conceptualized an **ultra-secure vault** designed to enhance the safety and privacy of digital assets. This solution addresses the growing concerns surrounding data breaches and theft in the blockchain space, making it highly relevant in today's digital landscape.

As we explored this idea further, we realized that its mechanics closely align with the well-known thought experiment involving **Alice and Bob**, which serves as an excellent introduction to **Zero-Knowledge Proofs (ZKProofs)**. In this scenario, Bob asks Alice to choose between two paths, A and B, without revealing his preference or which path she should take. These paths are separated by a wall, symbolizing the privacy layer that our vault aims to replicate. Just as Alice can prove her choice without disclosing specifics to Bob, our vault will allow users to verify transactions and ownership without revealing sensitive information.

<div align="center">
  <img src="https://github.com/user-attachments/assets/b43348bb-0549-418e-beba-af79ef84f6e0" alt="Schematic of Alice and Bob" width="800" />
  <p><em>Schematic of Alice and Bob illustrating Zero-Knowledge Proof</em></p>
</div>


Our Zero-Knowledge Proof feature, integrated with the **SUI blockchain**, can revolutionize the way users interact with their digital assets. Here are several key reasons why our idea is unique:

- **Enhanced Security**: By utilizing Zero-Knowledge Proofs, our vault ensures that sensitive user data remains confidential, significantly reducing the risk of hacking and data breaches.
- **User Empowerment**: Users have full control over their digital assets while being able to prove ownership and authorize transactions without sharing unnecessary information.
- **Scalability and Flexibility**: Built on the SUI blockchain, our vault benefits from its scalability and speed, ensuring a seamless user experience even as demand grows.
- **Real-World Applications**: Our practical example of a **hotel safe** highlights the concept effectively while demonstrating its potential use in various industries, such as finance, healthcare, and digital identity management.

In summary, our **ultra-secure vault leveraging ZKProofs** on the SUI blockchain is not just a concept but a groundbreaking solution that addresses urgent security needs in the digital age. With SUI's support, we believe we can bring this vision to life, benefiting users while establishing a new standard for security and privacy in blockchain transactions.

---

## Concrete Example of Use: Hotel Safe

In the hospitality industry, hotel safes provide guests with a secure space for storing valuable items like passports, jewelry, and electronics. However, traditional safes come with several issues that compromise guest trust and security.

### Problems

1. **Lack of Trust Towards Personnel**:
   - Guests often worry about the integrity of hotel staff who have access to the safes. Concerns arise about potential theft or misuse, leading to insecurity.
   - In cases where guests forget their access cards, they may fear that the hotel manager could open the safe without their permission, raising alarms about privacy violations.

2. **Single Point of Access**:
   - Conventional safes typically rely on a key or code that, if compromised, allows unauthorized access. If a key is lost or a code forgotten, it can delay access to personal items and cause frustration.

3. **Lack of Transparency**:
   - Guests may feel uneasy knowing that hotel staff can access their safes, even if they don't intend to. This lack of transparency can lead to discomfort during their stay.

### Solutions

1. **Enhanced Access Control Through ZKProofs**:
   - Our solution leverages **Zero-Knowledge Proofs** to ensure that only the guest can open the safe. Each guest has a unique cryptographic key tied to their identity, ensuring access without the risk of hotel staff (or others) opening the safe.
   - The contract lasts only for the duration of the guest's stay, ensuring access is automatically revoked once they check out.

2. **Multi-Party Validation**:
   - The safe can be programmed for **dual access**, allowing both the guest and the hotel manager to open it if the access card is lost. This requires a **smart contract** that validates both parties' credentials, ensuring the manager cannot access the safe without the guest's explicit approval.
   - Unlike traditional hotel safes, where the manager can potentially access the safe without the guest knowing, our solution empowers the guest to verify and control access. The guest can grant permission, but the manager cannot open the safe unilaterally.

3. **Audit Trails and Notifications**:
   - Our system incorporates **audit trails** that log every access attempt—successful or not. Guests receive real-time notifications on their mobile devices whenever access is attempted, providing an extra layer of security and peace of mind.
   - This feature reassures guests and holds hotel staff accountable, deterring any misuse of access rights.

---

## How It Works

- The vault is built on the **SUI blockchain**, benefiting from its speed and scalability.
- **Zero-Knowledge Proofs (ZKProofs)** allow users to prove they have access without revealing the underlying data.
- **Smart Contracts** ensure that only the correct parties can gain access, and only with mutual consent when necessary. The contract's access permissions last only for the guest’s stay, preventing any unwanted access after check-out.

## Future Applications

While the **hotel safe** is an excellent practical example, this solution has broader applications in various industries, such as:
- **Finance**: Secure storage of digital assets and confidential documents.
- **Healthcare**: Protecting sensitive patient records.
- **Digital Identity**: Secure, verifiable proof of identity without revealing personal details.

---

## Conclusion

Our **ultra-secure vault** solution, powered by Zero-Knowledge Proofs on the SUI blockchain, is a step toward transforming how privacy and security are handled in the digital world. We believe this solution not only addresses existing trust issues but also provides a new, secure way of handling valuable assets and data.

With SUI’s support, we are confident that we can bring this innovative vision to life, setting a new standard for blockchain security.

