from selenium import webdriver
from bs4 import BeautifulSoup
import time

# Set up WebDriver
driver = webdriver.Chrome()  # Ensure you have chromedriver installed
driver.get("https://clashofclans.fandom.com/wiki/Clash_of_Clans_Wiki")

# Wait for JavaScript to load
time.sleep(5)

# Parse page source
soup = BeautifulSoup(driver.page_source, "html.parser")

# Extract table data
table_data = soup.find_all("td", class_=["ModifierStat DPS", "ModifierStat DPH", "ModifierStat HP", "GoldPass rCost", "GoldPass rTime"])

# Print extracted data
for td in table_data:
    print(td.text.strip())

driver.quit()

