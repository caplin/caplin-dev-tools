package caplin.example.utils;

import net.thucydides.core.webdriver.DriverSource;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

public class CustomDriver implements DriverSource {

    @Override
    public WebDriver newDriver() {
        String browser = System.getProperty("browser");

        if (browser.equals("Chrome")) {
            return newChromeDriver();
        } else if (browser.equals("Firefox")) {
            return newFirefoxDriver();
        }

        return null;
    }

    private WebDriver newChromeDriver() {
        ChromeOptions options = new ChromeOptions();
        String binaryPath = System.getProperty("webdriver.chrome.bin");

        options.setBinary(binaryPath);
        options.addArguments("disable-popup-blocking");
        options.addArguments("start-maximized");

        return new ChromeDriver(options);
    }

    private WebDriver newFirefoxDriver() {
        DesiredCapabilities capabilities = DesiredCapabilities.firefox();
        capabilities.setCapability("marionette", true);

        return new FirefoxDriver(capabilities);
    }

    @Override
    public boolean takesScreenshots() {
        return true;
    }
}
