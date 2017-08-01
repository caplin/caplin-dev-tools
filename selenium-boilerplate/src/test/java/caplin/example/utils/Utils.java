package caplin.example.utils;

import net.serenitybdd.core.Serenity;
import org.jbehave.core.annotations.AfterStory;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;

import java.util.List;

import static caplin.example.utils.WaitUtils.*;
import static groovy.util.GroovyTestCase.assertEquals;


public class Utils {

    public static WebDriver getDriver() {
        return (WebDriver) Serenity.getCurrentSession().get("driver");
    }

    @AfterStory
    public void closeDriver() {
        Serenity.done();
    }

    public static void click(String selector) {
        WebElement element = waitForDisplayedCssElement(selector);
        click(element);
    }

    public static void click(WebElement element) {
        moveToElement(element);
        waitForCssElementToBeClickable(element);
        element.click();
    }

    public static void moveToElement(WebElement element) {
        new Actions(getDriver()).moveToElement(element).build().perform();
    }

    public static void enterTextAndWait(String selector, String text, String expectedText) {
        enterText(selector, text);
        waitForCssElementToHaveValue(selector, expectedText);
    }

    public static void enterText(String selector, String text) {
        enterText(waitForDisplayedCssElement(selector), text);
    }

    public static void enterText(WebElement element, String text) {
        element.clear();
        waitForMilliSeconds(200);
        element.sendKeys(text);
        element.sendKeys(Keys.TAB);
        triggerOnChange(element);
    }

    public static void enterTextIntoReactElement(String selector, String text) {
        WebElement reactElement = waitForDisplayedCssElement(selector);

        triggerReactFocus(reactElement);
        reactElement.sendKeys(text);
        triggerReactBlur(reactElement);
    }

    private static void triggerReactFocus(WebElement element) {
        ((JavascriptExecutor) getDriver()).executeScript("require('npm-modules').TestUtils.Simulate.focus(arguments[0]);", element);
    }

    private static void triggerReactBlur(WebElement element) {
        ((JavascriptExecutor) getDriver()).executeScript("require('npm-modules').TestUtils.Simulate.blur(arguments[0]);", element);
    }

    private static void triggerOnChange(WebElement element) {
        ((JavascriptExecutor) getDriver()).executeScript("$(arguments[0]).change(); return true;", element);
    }

    public static void selectOptionFromToggle(String toggleSelector, String optionToSelect) {
        WebElement toggle = waitForDisplayedCssElement(toggleSelector);

        selectOptionFromToggle(toggle, optionToSelect);
    }

    public static void selectOptionFromToggle(WebElement toggle, String optionToSelect) {
        if (!toggle.getText().equals(optionToSelect)) {
            click(toggle);
        }

        assertEquals("Toggle switch failed", optionToSelect, toggle.getText());
    }

    public static void enterOptionIntoDropdown(String dropdownSelector, String optionToSelect) {
        WebElement dropDown = waitForDisplayedCssElement(dropdownSelector);
        click(dropDown);

        WebElement inputField = waitForDisplayedSubElement(dropDown, "input");
        enterText(inputField, optionToSelect);
    }

    public static void selectOptionFromDropdown(String dropdownSelector, String optionToSelect) {
        WebElement dropDown = waitForDisplayedCssElement(dropdownSelector);
        selectOptionFromDropdown(dropDown, optionToSelect);
    }

    public static void selectOptionFromDropdown(WebElement dropDown, String optionToSelect) {
        click(dropDown);

        List<WebElement> options = dropDown.findElements(By.cssSelector("li"));
        for (WebElement option : options) {
            if (option.getText().contains(optionToSelect)) {
                moveToElement(option);
                click(option);
                break;
            }
        }
    }

    public static void doubleClick(WebElement element) {
        new Actions(getDriver()).doubleClick(element).build().perform();
    }

    public static void takeScreenshot() {
        Serenity.takeScreenshot();
    }

    public static void highlightElement(WebElement element, String colour) {
        String previous = element.getCssValue("background-color");

        ((JavascriptExecutor) getDriver()).executeScript("arguments[0].style.backgroundColor = '" + colour + "';", element);
        waitForMilliSeconds(200);
        ((JavascriptExecutor) getDriver()).executeScript("arguments[0].style.backgroundColor = '" + previous + "';", element);
    }
}
