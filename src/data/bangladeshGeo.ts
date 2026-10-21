export interface DistrictData {
  id: string;
  nameBn: string;
  nameEn: string;
  upazilas: { id: string; nameBn: string; nameEn: string }[];
}

export const BANGLADESH_DISTRICTS: DistrictData[] = [
  {
    id: 'dhaka',
    nameBn: 'ঢাকা',
    nameEn: 'Dhaka',
    upazilas: [
      { id: 'dhanmondi', nameBn: 'ধানমন্ডি', nameEn: 'Dhanmondi' },
      { id: 'mirpur', nameBn: 'মিরপুর', nameEn: 'Mirpur' },
      { id: 'uttara', nameBn: 'উত্তরা', nameEn: 'Uttara' },
      { id: 'gulshan', nameBn: 'গুলশান', nameEn: 'Gulshan' },
      { id: 'savar', nameBn: 'সাভার', nameEn: 'Savar' },
      { id: 'dhamrai', nameBn: 'ধামরাই', nameEn: 'Dhamrai' },
      { id: 'keraniganj', nameBn: 'কেরানীগঞ্জ', nameEn: 'Keraniganj' },
      { id: 'nawabganj', nameBn: 'নবাবগঞ্জ', nameEn: 'Nawabganj' },
      { id: 'dohar', nameBn: 'দোহার', nameEn: 'Dohar' },
      { id: 'badda', nameBn: 'বাড্ডা', nameEn: 'Badda' },
      { id: 'motijheel', nameBn: 'মতিঝিল', nameEn: 'Motijheel' },
      { id: 'demra', nameBn: 'ডেমরা', nameEn: 'Demra' }
    ]
  },
  {
    id: 'gazipur',
    nameBn: 'গাজীপুর',
    nameEn: 'Gazipur',
    upazilas: [
      { id: 'gazipur_sadar', nameBn: 'গাজীপুর সদর', nameEn: 'Gazipur Sadar' },
      { id: 'kaliakair', nameBn: 'কালিয়াকৈর', nameEn: 'Kaliakair' },
      { id: 'kapasia', nameBn: 'কাপাসিয়া', nameEn: 'Kapasia' },
      { id: 'sreepur', nameBn: 'শ্রীপুর', nameEn: 'Sreepur' },
      { id: 'kaliganj_g', nameBn: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
      { id: 'tongi', nameBn: 'টঙ্গী', nameEn: 'Tongi' }
    ]
  },
  {
    id: 'narayanganj',
    nameBn: 'নারায়ণগঞ্জ',
    nameEn: 'Narayanganj',
    upazilas: [
      { id: 'narayanganj_sadar', nameBn: 'নারায়ণগঞ্জ সদর', nameEn: 'Narayanganj Sadar' },
      { id: 'bandar', nameBn: 'বন্দর', nameEn: 'Bandar' },
      { id: 'rupganj', nameBn: 'রূপগঞ্জ', nameEn: 'Rupganj' },
      { id: 'sonargaon', nameBn: 'সোনারগাঁও', nameEn: 'Sonargaon' },
      { id: 'araihazar', nameBn: 'আড়াইহাজার', nameEn: 'Araihazar' },
      { id: 'fatullah', nameBn: 'ফতুল্লা', nameEn: 'Fatullah' },
      { id: 'siddhirganj', nameBn: 'সিদ্ধিরগঞ্জ', nameEn: 'Siddhirganj' }
    ]
  },
  {
    id: 'narsingdi',
    nameBn: 'নরসিংদী',
    nameEn: 'Narsingdi',
    upazilas: [
      { id: 'narsingdi_sadar', nameBn: 'নরসিংদী সদর', nameEn: 'Narsingdi Sadar' },
      { id: 'palash', nameBn: 'পলাশ', nameEn: 'Palash' },
      { id: 'belabo', nameBn: 'বেলাব', nameEn: 'Belabo' },
      { id: 'monohardi', nameBn: 'মনোহরদী', nameEn: 'Monohardi' },
      { id: 'raipura', nameBn: 'রায়পুরা', nameEn: 'Raipura' },
      { id: 'shibpur', nameBn: 'শিবপুর', nameEn: 'Shibpur' }
    ]
  },
  {
    id: 'munshiganj',
    nameBn: 'মুন্সীগঞ্জ',
    nameEn: 'Munshiganj',
    upazilas: [
      { id: 'munshiganj_sadar', nameBn: 'মুন্সীগঞ্জ সদর', nameEn: 'Munshiganj Sadar' },
      { id: 'sreenagar', nameBn: 'শ্রীনগর', nameEn: 'Sreenagar' },
      { id: 'sirajdikhan', nameBn: 'সিরাজদিখান', nameEn: 'Sirajdikhan' },
      { id: 'louhajang', nameBn: 'লৌহজং', nameEn: 'Louhajang' },
      { id: 'gajaria', nameBn: 'গজারিয়া', nameEn: 'Gajaria' },
      { id: 'tongibari', nameBn: 'টংগিবাড়ী', nameEn: 'Tongibari' }
    ]
  },
  {
    id: 'manikganj',
    nameBn: 'মানিকগঞ্জ',
    nameEn: 'Manikganj',
    upazilas: [
      { id: 'manikganj_sadar', nameBn: 'মানিকগঞ্জ সদর', nameEn: 'Manikganj Sadar' },
      { id: 'singair', nameBn: 'সিংগাইর', nameEn: 'Singair' },
      { id: 'shibalaya', nameBn: 'শিবালয়', nameEn: 'Shibalaya' },
      { id: 'saturia', nameBn: 'সাটুরিয়া', nameEn: 'Saturia' },
      { id: 'harirampur', nameBn: 'হরিরামপুর', nameEn: 'Harirampur' },
      { id: 'ghior', nameBn: 'ঘিওর', nameEn: 'Ghior' },
      { id: 'daulatpur', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur' }
    ]
  },
  {
    id: 'comilla',
    nameBn: 'কুমিল্লা',
    nameEn: 'Cumilla',
    upazilas: [
      { id: 'comilla_sadar', nameBn: 'কুমিল্লা আদর্শ সদর', nameEn: 'Cumilla Adarsha Sadar' },
      { id: 'comilla_sadar_dakshin', nameBn: 'কুমিল্লা সদর দক্ষিণ', nameEn: 'Cumilla Sadar Dakshin' },
      { id: 'daudkandi', nameBn: 'দাউদকান্দি', nameEn: 'Daudkandi' },
      { id: 'chandina', nameBn: 'চান্দিনা', nameEn: 'Chandina' },
      { id: 'debidwar', nameBn: 'দেবীদ্বার', nameEn: 'Debidwar' },
      { id: 'burichang', nameBn: 'বুড়িচং', nameEn: 'Burichang' },
      { id: 'brahmanpara', nameBn: 'ব্রাহ্মণপাড়া', nameEn: 'Brahmanpara' },
      { id: 'barura', nameBn: 'বরুড়া', nameEn: 'Barura' },
      { id: 'laksam', nameBn: 'লাকসাম', nameEn: 'Laksam' },
      { id: 'chauddagram', nameBn: 'চৌদ্দগ্রাম', nameEn: 'Chauddagram' },
      { id: 'homna', nameBn: 'হোমনা', nameEn: 'Homna' },
      { id: 'muradnagar', nameBn: 'মুরাদনগর', nameEn: 'Muradnagar' },
      { id: 'meghna', nameBn: 'মেঘনা', nameEn: 'Meghna' },
      { id: 'titas', nameBn: 'তিতাস', nameEn: 'Titas' }
    ]
  },
  {
    id: 'chittagong',
    nameBn: 'চট্টগ্রাম',
    nameEn: 'Chattogram',
    upazilas: [
      { id: 'kotwali', nameBn: 'কোতোয়ালী', nameEn: 'Kotwali' },
      { id: 'panchlaish', nameBn: 'পাঁচলাইশ', nameEn: 'Panchlaish' },
      { id: 'halishahar', nameBn: 'হালিশহর', nameEn: 'Halishahar' },
      { id: 'pahartali', nameBn: 'পাহাড়তলী', nameEn: 'Pahartali' },
      { id: 'sitakunda', nameBn: 'সীতাকুণ্ড', nameEn: 'Sitakunda' },
      { id: 'mirsharai', nameBn: 'মীরসরাই', nameEn: 'Mirsharai' },
      { id: 'hathazari', nameBn: 'হাটহাজারী', nameEn: 'Hathazari' },
      { id: 'raozan', nameBn: 'রাউজান', nameEn: 'Raozan' },
      { id: 'rangunia', nameBn: 'রাঙ্গুনিয়া', nameEn: 'Rangunia' },
      { id: 'boalkhali', nameBn: 'বোয়ালখালী', nameEn: 'Boalkhali' },
      { id: 'patiya', nameBn: 'পটিয়া', nameEn: 'Patiya' },
      { id: 'anwara', nameBn: 'আনোয়ারা', nameEn: 'Anwara' },
      { id: 'chandanaish', nameBn: 'চন্দনাইশ', nameEn: 'Chandanaish' },
      { id: 'satkania', nameBn: 'সাতকানিয়া', nameEn: 'Satkania' },
      { id: 'lohaghar', nameBn: 'লোহাগাড়া', nameEn: 'Lohagara' }
    ]
  },
  {
    id: 'brahmanbaria',
    nameBn: 'ব্রাহ্মণবাড়িয়া',
    nameEn: 'Brahmanbaria',
    upazilas: [
      { id: 'brahmanbaria_sadar', nameBn: 'ব্রাহ্মণবাড়িয়া সদর', nameEn: 'Brahmanbaria Sadar' },
      { id: 'kasba', nameBn: 'কসবা', nameEn: 'Kasba' },
      { id: 'akhaura', nameBn: 'আখাউড়া', nameEn: 'Akhaura' },
      { id: 'ashuganj', nameBn: 'আশুগঞ্জ', nameEn: 'Ashuganj' },
      { id: 'sarail', nameBn: 'সরাইল', nameEn: 'Sarail' },
      { id: 'nasirnagar', nameBn: 'নাসিরনগর', nameEn: 'Nasirnagar' },
      { id: 'nabinagar', nameBn: 'নবীনগর', nameEn: 'Nabinagar' },
      { id: 'bancharampur', nameBn: 'বাঞ্ছারামপুর', nameEn: 'Bancharampur' },
      { id: 'bijoynagar', nameBn: 'বিজয়নগর', nameEn: 'Bijoynagar' }
    ]
  },
  {
    id: 'tangail',
    nameBn: 'টাঙ্গাইল',
    nameEn: 'Tangail',
    upazilas: [
      { id: 'tangail_sadar', nameBn: 'টাঙ্গাইল সদর', nameEn: 'Tangail Sadar' },
      { id: 'mirzapur', nameBn: 'মির্জাপুর', nameEn: 'Mirzapur' },
      { id: 'delduar', nameBn: 'দেলদুয়ার', nameEn: 'Delduar' },
      { id: 'nagarpur', nameBn: 'নাগরপুর', nameEn: 'Nagarpur' },
      { id: 'kalihati', nameBn: 'কালিহাতী', nameEn: 'Kalihati' },
      { id: 'ghatail', nameBn: 'ঘাটাইল', nameEn: 'Ghatail' },
      { id: 'madhupur', nameBn: 'মধুপুর', nameEn: 'Madhupur' },
      { id: 'sakhipur', nameBn: 'সখিপুর', nameEn: 'Sakhipur' },
      { id: 'bhuapur', nameBn: 'ভূঞাপুর', nameEn: 'Bhuapur' },
      { id: 'gopalpur', nameBn: 'গোপালপুর', nameEn: 'Gopalpur' },
      { id: 'basail', nameBn: 'বাসাইল', nameEn: 'Basail' },
      { id: 'dhanbari', nameBn: 'ধনবাড়ী', nameEn: 'Dhanbari' }
    ]
  },
  {
    id: 'sylhet',
    nameBn: 'সিলেট',
    nameEn: 'Sylhet',
    upazilas: [
      { id: 'sylhet_sadar', nameBn: 'সিলেট সদর', nameEn: 'Sylhet Sadar' },
      { id: 'beanibazar', nameBn: 'বিয়ানীবাজার', nameEn: 'Beanibazar' },
      { id: 'golapganj', nameBn: 'গোলাপগঞ্জ', nameEn: 'Golapganj' },
      { id: 'biswanath', nameBn: 'বিশ্বনাথ', nameEn: 'Biswanath' },
      { id: 'balaganj', nameBn: 'বালাগঞ্জ', nameEn: 'Balaganj' },
      { id: 'south_surma', nameBn: 'দক্ষিণ সুরমা', nameEn: 'South Surma' },
      { id: 'fenchuganj', nameBn: 'ফেঞ্চুগঞ্জ', nameEn: 'Fenchuganj' },
      { id: 'zakiganj', nameBn: 'জকিগঞ্জ', nameEn: 'Zakiganj' },
      { id: 'osmaninagar', nameBn: 'ওসমানীনগর', nameEn: 'Osmaninagar' }
    ]
  },
  {
    id: 'rajshahi',
    nameBn: 'রাজশাহী',
    nameEn: 'Rajshahi',
    upazilas: [
      { id: 'boalia', nameBn: 'বোয়ালিয়া', nameEn: 'Boalia' },
      { id: 'rajpara', nameBn: 'রাজপাড়া', nameEn: 'Rajpara' },
      { id: 'motihar', nameBn: 'মতিহার', nameEn: 'Motihar' },
      { id: 'shah_makhdum', nameBn: 'শাহ মখদুম', nameEn: 'Shah Makhdum' },
      { id: 'paba', nameBn: 'পবা', nameEn: 'Paba' },
      { id: 'durgapur_r', nameBn: 'দুর্গাপুর', nameEn: 'Durgapur' },
      { id: 'godagari', nameBn: 'গোদাগাড়ী', nameEn: 'Godagari' },
      { id: 'bagmara', nameBn: 'বাগমারা', nameEn: 'Bagmara' },
      { id: 'charghat', nameBn: 'চারঘাট', nameEn: 'Charghat' }
    ]
  },
  {
    id: 'khulna',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    upazilas: [
      { id: 'khulna_sadar', nameBn: 'খুলনা সদর', nameEn: 'Khulna Sadar' },
      { id: 'sonadanga', nameBn: 'সোনাডাঙ্গা', nameEn: 'Sonadanga' },
      { id: 'khalishpur', nameBn: 'খালিশপুর', nameEn: 'Khalishpur' },
      { id: 'daulatpur_k', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur' },
      { id: 'dumuria', nameBn: 'ডুমুরিয়া', nameEn: 'Dumuria' },
      { id: 'botiaghata', nameBn: 'বটিয়াঘাটা', nameEn: 'Batiaghata' },
      { id: 'rupsha', nameBn: 'রূপসা', nameEn: 'Rupsha' },
      { id: 'phultala', nameBn: 'ফুলতলা', nameEn: 'Phultala' }
    ]
  },
  {
    id: 'barisal',
    nameBn: 'বরিশাল',
    nameEn: 'Barishal',
    upazilas: [
      { id: 'barisal_sadar', nameBn: 'বরিশাল সদর', nameEn: 'Barishal Sadar' },
      { id: 'bakerganj', nameBn: 'বাকেরগঞ্জ', nameEn: 'Bakerganj' },
      { id: 'babuganj', nameBn: 'বাবুগঞ্জ', nameEn: 'Babuganj' },
      { id: 'wazirpur', nameBn: 'উজিরপুর', nameEn: 'Wazirpur' },
      { id: 'banaripara', nameBn: 'বানারীপাড়া', nameEn: 'Banaripara' },
      { id: 'gournadi', nameBn: 'গৌরনদী', nameEn: 'Gournadi' },
      { id: 'agailjhara', nameBn: 'আগৈলঝাড়া', nameEn: 'Agailjhara' },
      { id: 'mehendiganj', nameBn: 'মেহেন্দিগঞ্জ', nameEn: 'Mehendiganj' }
    ]
  },
  {
    id: 'mymensingh',
    nameBn: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    upazilas: [
      { id: 'mymensingh_sadar', nameBn: 'ময়মনসিংহ সদর', nameEn: 'Mymensingh Sadar' },
      { id: 'muktagacha', nameBn: 'মুক্তাগাছা', nameEn: 'Muktagacha' },
      { id: 'fulbaria', nameBn: 'ফুলবাড়িয়া', nameEn: 'Fulbaria' },
      { id: 'trishal', nameBn: 'ত্রিশাল', nameEn: 'Trishal' },
      { id: 'bhaluka', nameBn: 'ভালুকা', nameEn: 'Bhaluka' },
      { id: 'gaffargaon', nameBn: 'গফরগাঁও', nameEn: 'Gaffargaon' },
      { id: 'iswarganj', nameBn: 'ঈশ্বরগঞ্জ', nameEn: 'Ishwarganj' },
      { id: 'phulpur', nameBn: 'ফুলপুর', nameEn: 'Phulpur' }
    ]
  },
  {
    id: 'rangpur',
    nameBn: 'রংপুর',
    nameEn: 'Rangpur',
    upazilas: [
      { id: 'rangpur_sadar', nameBn: 'রংপুর সদর', nameEn: 'Rangpur Sadar' },
      { id: 'badarganj', nameBn: 'বদরগঞ্জ', nameEn: 'Badarganj' },
      { id: 'mithapukur', nameBn: 'মিঠাপুকুর', nameEn: 'Mithapukur' },
      { id: 'gangachara', nameBn: 'গঙ্গাচড়া', nameEn: 'Gangachara' },
      { id: 'kaunia', nameBn: 'কাউনিয়া', nameEn: 'Kaunia' },
      { id: 'pirgachha', nameBn: 'পীরগাছা', nameEn: 'Pirgachha' },
      { id: 'pirganj', nameBn: 'পীরগঞ্জ', nameEn: 'Pirganj' },
      { id: 'taraganj', nameBn: 'তারাগঞ্জ', nameEn: 'Taraganj' }
    ]
  }
];
