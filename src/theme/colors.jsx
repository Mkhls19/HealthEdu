const colors = {
    // Warna untuk mode terang
    grey: (opacity = 1) => `rgba(109, 125, 154, ${opacity})`, // Abu-abu
    greenMint: (opacity = 1) => `rgba(152, 255, 152, ${opacity})`, // Hijau Mint
    neutralGrey: (opacity = 1) => `rgba(245, 245, 245, ${opacity})`, // Abu-abu Netral
    orangeBright: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Oranye Cerah
    white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Putih
    black: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Hitam
  
    // Warna untuk mode gelap
    darkModeBackground: (opacity = 1) => `rgba(18, 18, 18, ${opacity})`, // Latar belakang gelap
    darkModeText: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Teks putih untuk mode gelap
    darkModeGreen: (opacity = 1) => `rgba(50, 205, 50, ${opacity})`, // Hijau untuk mode gelap
    darkModeOrange: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`, // Oranye untuk mode gelap
  };
  
  export default colors;