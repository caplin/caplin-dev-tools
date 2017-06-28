package caplin.example.pages;

import static caplin.example.selectors.LoginSelectors.*;
import static caplin.example.utils.Utils.*;

public class LoginPage extends BasePage {

    public void logIn(String username, String password){
        enterText(USERNAME_TEXTBOX, username);
        enterText(PASSWORD_BOX, password);

        click(LOGIN_BUTTON);
    }
}
