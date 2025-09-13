# Hydration Tracker

Aplikacja do śledzenia nawodnienia – szybkie dodawanie porcji, wykres 7 dni i własny cel dzienny.

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
- Animowane kółko postępu ze zmianą koloru po osiągnięciu celu
- Historia zmian w ciągu dnia z rozróżnieniem kolorami (niebieski - dodanie ilości, czerwony - odjęcie ilości)
- Wykres 7 dni z danymi zapisanymi w `localStorage`.
- Responsywny układ – dobrze wygląda na komputerze i urządzeniu przenośnym

## Instalacja i uruchomienie
1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/JakubPep/hydration-tracker.git
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

## Architektura i podejście projektowe
Aplikacja została zaprojektowana w oparciu o prostą, przejrzystą architekturę przy użyciu **React Hooks** i zarządzaniu stanem lokalnym:
- **Komponent główny App** zawiera całą logikę aplikacji i odpowiada za przechowywanie stanu (spożycie wody, historia, cel dzienny).
- Dane użytkownika (historia spożycia oraz cel dzienny) są trwale zapisywane w **localStorage**, aby były dostępne po ponownym uruchomieniu aplikacji.
- Logika dodawania, cofania i resetowania wpisów działa na zasadzie modyfikacji historii dnia i aktualizacji bieżącego stanu.
- **Tailwind CSS** zapewnia spójne i szybkie tworzenie responsywnego interfejsu, który automatycznie dostosowuje się do trybu jasnego/ciemnego urządzenia.
- **Recharts** odpowiada za wizualizację danych w formie wykresu z ostatnich 7 dni.

### Uzasadnienie podejścia
- **React + Hooks** – umożliwia prostą i czytelną implementację logiki, bez potrzeby stosowania zewnętrznych bibliotek do zarządzania stanem (np. Redux), co zmniejsza złożoność projektu.
- **LocalStorage** – gwarantuje prostą i wystarczającą persystencję danych dla aplikacji, bez konieczności tworzenia backendu.
- **Tailwind CSS** – zapewnia szybkie tworzenie interfejsu, czytelność kodu oraz natywne wsparcie dla trybu ciemnego.
- **Recharts** – gotowa biblioteka do wizualizacji danych. Pozwala w łatwy sposób przedstawić historię nawodnienia na wykresie.

Architektura oparta na jednym komponencie nadrzędnym i prostych komponentach podrzędnych jest wystarczająca dla tego typu projektu, a jednocześnie pozwala łatwo rozszerzyć aplikację o dodatkowe funkcje w razie potrzeby.
