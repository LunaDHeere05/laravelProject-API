 <h1>API Project README</h1>

<h2>Overzicht</h2>
    <p>Dit project is een API ontwikkeld met behulp van <strong>JavaScript</strong>, <strong>MySQL</strong>, <strong>Postman</strong> en <strong>WSL (Windows Subsystem for Linux)</strong>. De API stelt gebruikers in staat gegevens op te halen, toe te voegen, bij te werken en te verwijderen uit een MySQL-database.</p>
<h2>Installatie-instructies</h2>

<h3>Vereisten</h3>
    <ul>
        <li><strong>Node.js</strong> en <strong>npm</strong>: Zorg dat Node.js en npm zijn geïnstalleerd op je systeem.</li>
        <li><strong>MySQL</strong>: Een draaiende MySQL-database.</li>
        <li><strong>Postman</strong>: Voor het testen van de API.</li>
        <li><strong>WSL</strong>: Voor een Linux-achtige omgeving binnen Windows.</li>
    </ul>

<h3>Stap 1: Repository klonen</h3>
    <pre><code>git clone &lt;repository-url&gt;
cd &lt;repository-map&gt;</code></pre>

  <h3>Stap 2: Installeren van afhankelijkheden</h3>
    <pre><code>npm install</code></pre>

  <h3>Stap 3: Configuratie</h3>
    <p>Maak een <code>.env</code>-bestand in de root van het project en voeg de volgende configuratie toe:</p>
    <pre><code>DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=laravelProject
DB_USER=Luna
DB_PASSWORD=Tester321!

IP_ADDRESS=127.0.0.1
PORT=5500</code></pre>

  <h3>Stap 5: Start de server</h3>
    <pre><code>node index.js</code></pre>
    <p>De server draait nu op <code>http://127.0.0.1:5500</code>.</p>
    <p>Klik op de link die je in de terminal krijgt en bekijk de API documentatie.</p>

<h1>Sources</h1>
<a href="https://chatgpt.com/share/67882ea7-75a0-8002-b89b-27ab85932fb3">Setup met behulp van chatgpt</a>
<a href="https://chatgpt.com/share/67882f1e-02b0-8002-8e00-03010475e5c3">debugging met chatgpt</a>
