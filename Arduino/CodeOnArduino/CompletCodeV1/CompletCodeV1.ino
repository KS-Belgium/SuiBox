#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>
#include <Servo.h>

Servo servoMotor;

PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);

const int ledMode = 10; // LED to indicate mode (on = writing)
const int ledOpen = 2;
const int ledClose = 3;
String code = "null"; // Code to read (initialized to "null")
String message = "null";
int coffreState = false; // false = closed, true = open
bool isWriting = false;

void setup() {
  pinMode(ledMode, OUTPUT); // Initialize the LED as output
  servoMotor.attach(7); // Specify the pin to which the servo is connected 
  servoMotor.write(179); // close
  digitalWrite(ledClose, HIGH);
  digitalWrite(ledOpen, LOW);
  Serial.begin(115200); // Initialize serial communication
  Serial.println("System initialized");
  nfc.begin();  // Initialize the NFC module
}

void loop() {
  String input = Serial.readString();
  input.trim();
  if (input == "write") {
    isWriting = true;
  }

  if (!isWriting) {
    // Read mode
    digitalWrite(ledMode, LOW); // Turn off the LED
    Serial.println("\nScan a NFC tag\n");

    if (nfc.tagPresent()) {  // Check if an NFC tag is present
      NfcTag tag = nfc.read();  // Read the tag

      if (tag.hasNdefMessage()) {
        NdefMessage ndefMessage = tag.getNdefMessage();
        int recordCount = ndefMessage.getRecordCount();

        Serial.print("Number of NDEF records found: ");
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

          // Ignore the last two characters 
          String textMessage = payloadAsString.substring(1, payloadAsString.length() - 2); 

          // Check if the message matches the expected code
          Serial.print("Record "); Serial.println(i + 1);
          Serial.print("Payload: "); Serial.println(textMessage);
          
          if (textMessage == code and code != "null") {
            if (coffreState) {
              Serial.println("Correct code, closing the coffre: ");
              moveDoor(servoMotor);
            }
            else if (!coffreState) {
              Serial.println("Correct code");
              Serial.println("Ask for contract confirmation");
              while (Serial.available() == 0) {
                // Wait for the user to enter a message
              }
              message = Serial.readString();
              message.trim(); // Remove spaces around
              Serial.println(message);
              if(message == "true"){
                Serial.println("Open");
                moveDoor(servoMotor);
              }
              if(message == "false"){
                Serial.println("Confirmation fail");
              }
            }
            textMessage = "null";
          } 
          else {
            Serial.print("Failed code: " + code + ", recu: " + textMessage);
          }
        }
      } else {
        Serial.println("No NDEF message found on this tag.");
      }
    } else {
      Serial.println("No NFC card detected.");
    }
  }

  if (isWriting) {
    // Writing mode
    digitalWrite(ledMode, HIGH); // Turn on the LED

    Serial.println("Which code do you want to write? (enter the code)");
    while (Serial.available() == 0) {
      // Wait for the user to enter a message
    }
    message = Serial.readString();
    message.trim(); // Remove spaces around

    if (message == "error") {
      Serial.println("Error code received, canceling write");
      isWriting = false;
    }

    if (message != "error") {
      Serial.println("\nPlace a formatted NFC card on the reader.");

      // Wait for the NFC card to be present for writing
      while (!nfc.tagPresent()) {
        // Active waiting
}

      NfcTag tag = nfc.read();  // Read the tag
      String tagId = tag.getUidString();
      Serial.print("Card UID: ");
      Serial.println(tagId);

      // Write the text message to the card
      NdefMessage ndefMessage;
      ndefMessage.addTextRecord("fr", message);

      // Write the NDEF message to the card
      if (nfc.write(ndefMessage)) {
        code = message; // Update the code to read
        Serial.println("Write successful!");
        Serial.print("Code: " + message);
        isWriting = false; // Switch to read mode after writing
        digitalWrite(ledMode, LOW);
        delay(2000);
      }
      else {
        Serial.println("Write failed.");
        isWriting = false;
      }
    }
  }

  delay(500); // Wait 2000 milliseconds before the next read
}

void moveDoor(Servo &servoMotor) {
    coffreState = !coffreState; // Toggle state
    if (coffreState) {
        servoMotor.write(1); // Open
        digitalWrite(ledOpen, HIGH);
        digitalWrite(ledClose, LOW);
    } else {
        servoMotor.write(179); // Close
        digitalWrite(ledClose, HIGH);
        digitalWrite(ledOpen, LOW);
    }
    delay(2000);
}