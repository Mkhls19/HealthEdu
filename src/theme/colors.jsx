const colors = {
    // Warna untuk mode terang
    grey: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    greenMint: (opacity = 1) => `rgba(0, 200, 150, ${opacity})`,
    neutralGrey: (opacity = 1) => `rgba(245, 245, 245, ${opacity})`, // Abu-abu Netral
    orangeBright: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Oranye Cerah
    white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Putih
    black: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Hitam

    // Warna tambahan yang dibutuhkan
    lightGreen: (opacity = 1) => `rgba(144, 238, 144, ${opacity})`, // Contoh: lightgreen
    lightBlue: (opacity = 1) => `rgba(173, 216, 230, ${opacity})`, // Contoh: lightblue
    blueMain: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,     // Contoh: blue
    lightGrey: (opacity = 1) => `rgba(211, 211, 211, ${opacity})`, // Contoh: lightgrey
    greenMain: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,     // Contoh: green
    extraLightGrey: (opacity = 1) => `rgba(230, 230, 230, ${opacity})`, // Contoh

    // Warna untuk mode gelap
    darkModeBackground: (opacity = 1) => `rgba(18, 18, 18, ${opacity})`, // Latar belakang gelap
    darkModeText: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Teks putih untuk mode gelap
    darkModeGreen: (opacity = 1) => `rgba(50, 205, 50, ${opacity})`, // Hijau untuk mode gelap
    darkModeOrange: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`, // Oranye untuk mode gelap
  };
export default colors;