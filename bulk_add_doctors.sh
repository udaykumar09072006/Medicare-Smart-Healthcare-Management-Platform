#!/bin/bash

# Bulk add 20 doctors with images from frontend/src/assets

API_URL="http://localhost:4000/api/doctors"
ASSETS_PATH="/Users/sonukumar/Desktop/MEDICARE/frontend/src/assets"

# Doctor data array
declare -a DOCTORS=(
  "Dr. Rahul Sharma|dr.rahul@gmail.com|123456|Cardiologist|10|500|MBBS, MD|Delhi|Heart specialist with 10 years experience.|D1.png"
  "Dr. Priya Verma|dr.priya@gmail.com|123456|Dermatologist|8|400|MBBS, MD|Mumbai|Expert in skin and hair treatments.|D2.png"
  "Dr. Amit Singh|dr.amit@gmail.com|123456|Neurologist|12|700|MBBS, DM|Lucknow|Experienced brain and nerve specialist.|D3.png"
  "Dr. Neha Kapoor|dr.neha@gmail.com|123456|Pediatrician|7|350|MBBS, DCH|Noida|Child healthcare expert.|D4.png"
  "Dr. Arjun Mehta|dr.arjun@gmail.com|123456|Orthopedic|15|600|MBBS, MS|Pune|Bone and joint specialist.|D5.png"
  "Dr. Sneha Gupta|dr.sneha@gmail.com|123456|Gynecologist|9|450|MBBS, MS|Jaipur|Women's health specialist.|D6.png"
  "Dr. Vikram Joshi|dr.vikram@gmail.com|123456|ENT Specialist|11|400|MBBS, MS|Chandigarh|Ear, nose and throat expert.|D7.png"
  "Dr. Pooja Malhotra|dr.pooja@gmail.com|123456|Ophthalmologist|8|500|MBBS, MS|Gurgaon|Eye care and vision specialist.|D8.png"
  "Dr. Karan Patel|dr.karan@gmail.com|123456|Urologist|13|650|MBBS, MCh|Ahmedabad|Specialist in urinary disorders.|D9.png"
  "Dr. Riya Sharma|dr.riya@gmail.com|123456|Dentist|6|300|BDS, MDS|Kanpur|Advanced dental care expert.|D10.png"
  "Dr. Mohit Bansal|dr.mohit@gmail.com|123456|Psychiatrist|10|550|MBBS, MD|Delhi|Mental health specialist.|D11.png"
  "Dr. Anjali Roy|dr.anjali@gmail.com|123456|Endocrinologist|9|600|MBBS, DM|Kolkata|Diabetes and hormone expert.|D12.png"
  "Dr. Rohit Yadav|dr.rohit@gmail.com|123456|Pulmonologist|11|650|MBBS, MD|Agra|Respiratory disease specialist.|HD1.png"
  "Dr. Kavita Jain|dr.kavita@gmail.com|123456|Oncologist|14|800|MBBS, DM|Mumbai|Cancer treatment specialist.|HD2.png"
  "Dr. Sandeep Kumar|dr.sandeep@gmail.com|123456|General Physician|8|300|MBBS|Patna|Experienced family physician.|HD3.png"
  "Dr. Meera Nair|dr.meera@gmail.com|123456|Gastroenterologist|12|700|MBBS, DM|Kochi|Digestive system specialist.|HD4.png"
  "Dr. Aditya Rao|dr.aditya@gmail.com|123456|Nephrologist|10|650|MBBS, DM|Hyderabad|Kidney disease expert.|HD5.png"
  "Dr. Shreya Das|dr.shreya@gmail.com|123456|Rheumatologist|7|500|MBBS, MD|Bhubaneswar|Arthritis and joint care specialist.|HD6.png"
  "Dr. Nitin Saxena|dr.nitin@gmail.com|123456|Surgeon|16|900|MBBS, MS|Indore|General and laparoscopic surgeon.|HD7.png"
  "Dr. Aisha Khan|dr.aisha@gmail.com|123456|Allergist|5|350|MBBS, MD|Bangalore|Allergy and immunology specialist.|HD8.png"
)

echo "Starting bulk doctor insertion..."
COUNT=0
SUCCESS=0
FAILED=0

for DOCTOR_DATA in "${DOCTORS[@]}"; do
  IFS='|' read -r NAME EMAIL PASSWORD SPEC EXP FEE QUAL LOC ABOUT IMAGE <<< "$DOCTOR_DATA"
  
  COUNT=$((COUNT + 1))
  IMAGE_PATH="$ASSETS_PATH/$IMAGE"
  
  echo ""
  echo "[$COUNT/20] Adding: $NAME ($EMAIL) with image $IMAGE"
  
  # Make the API call with image
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -F "name=$NAME" \
    -F "email=$EMAIL" \
    -F "password=$PASSWORD" \
    -F "specialization=$SPEC" \
    -F "experience=$EXP" \
    -F "fee=$FEE" \
    -F "qualifications=$QUAL" \
    -F "location=$LOC" \
    -F "about=$ABOUT" \
    -F "image=@$IMAGE_PATH")
  
  # Extract status code (last line)
  HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  
  if [[ "$HTTP_CODE" == "201" ]]; then
    SUCCESS=$((SUCCESS + 1))
    echo "✅ Success (201)"
  else
    FAILED=$((FAILED + 1))
    echo "❌ Failed ($HTTP_CODE)"
    echo "Response: $BODY" | head -c 200
    echo ""
  fi
done

echo ""
echo "========================================"
echo "Bulk insertion complete!"
echo "Total: $COUNT | Success: $SUCCESS | Failed: $FAILED"
echo "========================================"
