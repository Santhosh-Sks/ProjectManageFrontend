package services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInvitationEmail(String toEmail, String projectId, String invitationUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("You're Invited to Collaborate on a Project!");

            String content = getInvitationEmailContent(projectId, invitationUrl);
            helper.setText(content, true);

            mailSender.send(message);
            System.out.println("Invitation email sent successfully to " + toEmail);
        } catch (MessagingException | MailException e) {
            System.err.println("Failed to send invitation email to " + toEmail);
            e.printStackTrace();
        }
    }
} 