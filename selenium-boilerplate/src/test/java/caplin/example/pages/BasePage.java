package caplin.example.pages;

import caplin.example.utils.WaitUtils;
import net.serenitybdd.core.Serenity;
import net.serenitybdd.core.pages.PageObject;

import static caplin.example.selectors.BaseSelectors.*;
import static caplin.example.utils.Utils.click;

public class BasePage extends PageObject {

    public void loadApp() {
        // Used in Utils and WaitUtils
        Serenity.getCurrentSession().put("driver", getDriver());

        open();
        getDriver().manage().window().maximize();
    }

    public void clickLoginButton() {
        click(HEADER_BAR_LOGIN_BUTTON);
    }

    public void checkLoggedIn() {
        WaitUtils.waitForDisplayedCssElement(HEADER_BAR_LOGEDIN_ICON);
    }

}
