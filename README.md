# Hydration Tracker

Aplikacja do śledzenia nawodnienia – szybkie dodawanie porcji, wykres 7 dni i personalizowany cel dzienny.

## Opis
Hydration Tracker to aplikacja webowa stworzona w **React** z użyciem **Tailwind CSS** i **Recharts**. Umożliwia:
- łatwe śledzenie dziennego spożycia wody,
- szybkie dodawanie porcji (100 ml, 250 ml, 350 ml, 500 ml lub własna ilość),
- cofnięcie ostatniej akcji lub reset dnia,
- podgląd szczegółowej historii dnia z wyróżnieniem kolorystycznym dodanych/odjętych porcji,
- wizualizację postępów na wykresie z ostatnich 7 dni,
- automatyczne dopasowanie do trybu jasnego/ciemnego systemu,
- ustawienie własnego celu dziennego w ustawieniach.

## Podgląd funkcji
- Animowane kółko postępu z zielonym kolorem po osiągnięciu celu.
- Historia z przewijaniem i kolorami akcji (niebieski – dodanie, czerwony – odjęcie).
- Wykres 7 dni z danymi zapisanymi w `localStorage`.
- Responsywny układ – dobrze wygląda na desktopie i mobile.

## Instalacja i uruchomienie
1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/twoj-login/hydration-tracker.git
   cd hydration-tracker
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

3. Uruchom aplikację w trybie deweloperskim:
   ```bash
   npm start
   ```

4. Aplikacja będzie dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

## Technologie
- React 18
- Tailwind CSS 3
- Recharts
- Lucide React (ikony)
