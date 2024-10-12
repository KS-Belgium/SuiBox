# SuiBox

A security system for hotel safes and more, built with Sui Technology. It addresses the issues of lack of trust and lack of security regarding safes in public environments.

## Demo

Insert gif or link to demo

## Authors

- [Yassine](https://github.com/Yionidas)
- [Lorenzo](https://github.com/LorenzoLepoivre/LorenzoLepoivre)
- [William](https://github.com/WillHCode)

## Features

- Unique access to the safe for each customer via blockchain signature
- Access with an NFC badge or through a secure blockchain-based system
- Automated user rental management: safes are assigned based on room bookings and freed up upon checkout

## Tech Stack

**Front-end:** React, Tailwind  
**Back-end:** Sui Move, Python, C++ (Arduino)

## Concrete Example: Traditional Hotel Safe Issues

In the hospitality industry, hotel safes provide a space for guests to store valuables like passports, jewelry, and electronics. However, traditional hotel safes come with issues that can compromise guest trust and security:

1. **Lack of Trust**:  
   Guests often worry that hotel personnel could access the safe, raising concerns about privacy and theft.
   
2. **Single Point of Access**:  
   Safes typically rely on keys or codes. If these are compromised, it leads to security breaches.

3. **No Transparency**:  
   Guests have no visibility into who has accessed their safe, which can cause discomfort during their stay.

## Solution: Blockchain-Linked Safe with Sui

### 1. **Enhanced Security Through Blockchain Signatures**  
   Each guest's safe is linked to their identity on the blockchain, requiring a cryptographic signature to unlock. Only the guest can open the safe, ensuring no unauthorized access from hotel staff.

### 2. **Dual Access for Emergencies**  
   In case the guest loses their NFC badge or forgets their signature, a backup system can be implemented where both the guest and hotel manager must approve access via a smart contract. The manager can only open the safe with the guest's explicit consent.

### 3. **Audit Trails and Notifications**  
   Every attempt to access the safe is logged on the blockchain, creating an immutable audit trail. Guests receive real-time notifications when any access attempt is made, providing peace of mind and accountability.

## How It Works

- The system is built on the **Sui blockchain**, taking advantage of its speed and scalability.
- **Smart Contracts** are used to assign safes to guests, manage access, and revoke permissions automatically at the end of a guest's stay.
- Guests can unlock the safe using an NFC badge or through their blockchain wallet with a secure signature.

## Future Applications

Beyond hotel safes, this solution could be adapted for various industries:
- **Logistics**: Secure and trackable package deliveries
- **Finance**: Safety deposit boxes managed securely on the blockchain
- **Public Lockers**: In airports, gyms, or co-working spaces, providing users with secure, self-managed storage

## Conclusion

SuiBox, powered by Sui, provides an innovative, blockchain-secured solution for physical safes and lockers. This system ensures guest privacy, eliminates the risk of unauthorized access, and brings transparency through blockchain audit trails. Our technology can revolutionize security in hotels and beyond, applying to a wide range of industries that require safe and controlled access to physical assets.
