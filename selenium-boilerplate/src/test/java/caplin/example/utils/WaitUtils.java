package caplin.example.utils;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static caplin.example.utils.Utils.getDriver;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;

public class WaitUtils {

    private static int TIMEOUT_SECONDS = 10;

    private static void printWaitMessage(String selector) {
        System.out.println("Waiting for css selector element(s): <" + selector + ">");
    }

    // C O N D I T I O N A L  W A I T S
    public static WebElement waitForDisplayedCssElement(String selector) {
        printWaitMessage(selector);
        try {
            return new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until((ExpectedCondition<WebElement>) webDriver -> {
                return webDriver.findElements(By.cssSelector(selector)).stream()
                        .filter(WebElement::isDisplayed).findFirst().orElse(null);
            });
        } catch (TimeoutException e) {
            org.junit.Assert.fail("No visible element with the CSS Selector of <" + selector + ">");
            return null;
        }
    }

    public static List<WebElement> waitForAllDisplayedCssElements(String selector) {
        printWaitMessage(selector);
        try {
            return new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until((ExpectedCondition<List<WebElement>>) webDriver -> {
                List<WebElement> allElements = webDriver.findElements(By.cssSelector(selector)).stream()
                        .filter(WebElement::isDisplayed).collect(Collectors.toList());
                return !allElements.isEmpty() ? allElements : null;
            });
        } catch (TimeoutException e) {
            org.junit.Assert.fail("No visible elements with the CSS Selector of <" + selector + ">");
            return null;
        }
    }

    public static String waitForFirstDisplayedCssElement(String... selectors) {
        try {
            return new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until((ExpectedCondition<String>) webDriver -> {
                WebElement element = null;
                for (String selector : selectors) {
                    printWaitMessage(selector);

                    try {
                        element = webDriver.findElement(By.cssSelector(selector));
                    } catch (NoSuchElementException e) {
                        //
                    }

                    if (element != null && element.isDisplayed()) {
                        return selector;
                    }
                }

                return null;
            });
        } catch (TimeoutException e) {
            org.junit.Assert.fail("No visible elements with the CSS Selectors of <" + Arrays.toString(selectors) + ">");
            return null;
        }
    }

    public static WebElement waitForDisplayedSubElement(WebElement parent, String child) {
        System.out.println("Waiting for displayed child: " + child);
        return new WebDriverWait(getDriver(), TIMEOUT_SECONDS)
                .until(visibilityOfNestedElementsLocatedBy(parent, By.cssSelector(child))).get(0);
    }

    public static void waitForElementToDisappear(String selector) {
        new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until(invisibilityOfElementLocated(By.cssSelector(selector)));
    }

    public static void waitForCssElementToHaveText(String selector, String text) {
        new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until(textToBePresentInElementLocated(By.cssSelector(selector), text));
    }

    public static void waitForCssElementToHaveValue(String selector, String text) {
        WebElement element = waitForDisplayedCssElement(selector);
        new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until(textToBePresentInElementValue(element, text));
    }

    public static void waitForElementToHaveClass(WebElement element, String value) {
        new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until(attributeContains(element, "class", value));
    }

    public static void waitForCssElementToBeClickable(WebElement element) {
        new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until(and(elementToBeClickable(element),
                not(attributeContains(element, "class", "disabled"))));
    }

    public static void waitForNumberOfElementsToBe(String selector, int numberOfElements) {
        new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until(numberOfElementsToBe(By.cssSelector(selector), numberOfElements));
    }

    public static void waitForUrlToContain(String url) {
        new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until(urlContains(url));
    }

    public static void waitForNewWindow(int windowsBefore) {
        new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until((ExpectedCondition<Boolean>) webDriver ->
                webDriver.getWindowHandles().size() == windowsBefore + 1);
    }

    public static List<WebElement> waitForRowsWithID(String id) {
        return waitForRowsWithID(".caplin-grid .row", id);
    }

    public static List<WebElement> waitForSpecificBlotterRowsWithID(String blotterSelector, String id) {
        return waitForRowsWithID(blotterSelector + " .caplin-grid .row", id);
    }

    private static List<WebElement> waitForRowsWithID(String rowSelector, String id) {
        try {
            return new WebDriverWait(getDriver(), TIMEOUT_SECONDS).until((ExpectedCondition<List<WebElement>>) webDriver -> {
                System.out.println("Looking for ID: " + id);
                List<WebElement> allRows = waitForAllDisplayedCssElements(rowSelector).stream()
                        .filter(row -> waitForDisplayedSubElement(row, "[class$='ID'] span").getText().contains(id))
                        .collect(Collectors.toList());
                return !allRows.isEmpty() ? allRows : null;
            });
        } catch (TimeoutException e) {
            org.junit.Assert.fail("Did not find any rows with Trade/Order ID of '" + id + "'");
            return null;
        }
    }

    // I M P L I C I T  W A I T S
    public static void waitForMilliSeconds(int milliSecs) {
        try {
            Thread.sleep(milliSecs);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void waitForSeconds(int seconds) {
        waitForMilliSeconds(seconds * 1000);
    }
}