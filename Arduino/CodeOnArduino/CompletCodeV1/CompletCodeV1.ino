#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>
#include <Servo.h>

Servo servoMotor;

PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);

const int ledMode = 10; // LED pour indiquer le mode (allumé = écriture)
const int ledOpen = 2;
const int ledClose = 3;
String code = "null"; // Le code à lire (initialisé à "null")
String message = "null";
int etatCoffre = false; // false = fermer, true = ouvert
bool isWriting = false;

void setup() {
  pinMode(ledMode, OUTPUT); // Initialiser la LED en sortie
  servoMotor.attach(7); // Indiquez la broche à laquelle le servo est connecté 
  servoMotor.write(179); //close
  digitalWrite(ledClose, HIGH);
  digitalWrite(ledOpen, LOW);
  Serial.begin(115200); // Initialiser la communication série
  Serial.println("Système initialisé");
  nfc.begin();  // Initialiser le module NFC
}

void loop() {
  String input = Serial.readString();
  input.trim();
  if(input == "write"){
    isWriting = true;
  }

  if(!isWriting){
     // Mode lecture
    if (code != "null") {
      digitalWrite(ledMode, LOW); // Éteindre la LED
      Serial.println("\nScan a NFC tag\n");

      if (nfc.tagPresent()) {  // Vérifie si un tag NFC est présent
        NfcTag tag = nfc.read();  // Lire le tag

        if (tag.hasNdefMessage()) {
          NdefMessage ndefMessage = tag.getNdefMessage();
          int recordCount = ndefMessage.getRecordCount();

          Serial.print("Nombre d'enregistrements NDEF trouvés: ");
          Serial.println(recordCount);

          for (int i = 0; i < recordCount; i++) {
            NdefRecord record = ndefMessage.getRecord(i);
            int payloadLength = record.getPayloadLength();
            byte payload[payloadLength];
            record.getPayload(payload);

            String payloadAsString = "";
            for (int c = 0; c < payloadLength; c++) {
              payloadAsString += (char)payload[c];
            }

            // Ignorer les deux derniers caractères 
            String textMessage = payloadAsString.substring(1, payloadAsString.length() - 2); 

            // Vérifier si le message correspond au code attendu
            Serial.print("Enregistrement "); Serial.println(i + 1);
            Serial.print("Charge utile: "); Serial.println(textMessage);
            
            if (textMessage == code) {
              if(etatCoffre){
                Serial.println("Bon code, fermeture du coffre: ");
              }
              if(!etatCoffre){
                Serial.println("Bon code, ouverture du coffre: ");
              }
              moveDoor(servoMotor);
            } else {
              Serial.println("Pas le bon code: " + textMessage);
            }
          }
        } else {
          Serial.println("Aucun message NDEF trouvé sur ce tag.");
        }
      } else {
        Serial.println("Aucune carte NFC détectée.");
      }
    }
  }

  if(isWriting){
    // Mode écriture
    digitalWrite(ledMode, HIGH); // Allumer la LED

    Serial.println("Quel code voulez-vous écrire ? (entrez le code)");
      while (Serial.available() == 0) {
        // Attendre que l'utilisateur entre un message
      }
      message = Serial.readString();
      message.trim(); // Enlever les espaces autour

    if (message == "error"){
      Serial.println("Code d'erreur reçu, annulation de l'écriture");
      isWriting = false;
    }

    if(message != "error"){
      Serial.println("\nPlacez une carte NFC formatée sur le lecteur.");

      // Attendre que la carte NFC soit présente pour l'écriture
      while (!nfc.tagPresent()) {
        // Attente active
      }

      NfcTag tag = nfc.read();  // Lire le tag
      String tagId = tag.getUidString();
      Serial.print("UID de la carte: "); 
      Serial.println(tagId);
      
      // Écrire le message texte sur la carte
      NdefMessage ndefMessage;
      ndefMessage.addTextRecord("fr", message); 

      // Écrire le message NDEF sur la carte
      if (nfc.write(ndefMessage)) {
        code = message; // Mettre à jour le code à lire
        Serial.println("Écriture réussie !");
        Serial.print("Code : " + message);
        isWriting = false; // Passer en mode lecture après l'écriture
      } 
      else {
        Serial.println("Échec de l'écriture.");
        isWriting = false;
      }
    }
  }

  delay(2000); // Attendre x000 secondes avant la prochaine lecture
}

void moveDoor(Servo &servoMotor){
    etatCoffre = !etatCoffre; // Toggle state
    if (etatCoffre) {
        servoMotor.write(1); // Open
        digitalWrite(ledOpen, HIGH);
        digitalWrite(ledClose, LOW);
    } else {
        servoMotor.write(179); // Close
        digitalWrite(ledClose, HIGH);
        digitalWrite(ledOpen, LOW);
    }
}

