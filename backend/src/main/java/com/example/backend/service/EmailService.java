package com.example.backend.service;

import com.example.backend.model.Vehicle;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.from-email}")
    private String fromEmail;

    @Async
    public void sendOilChangeReminder(Vehicle vehicle) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(vehicle.getOwnerEmail());
            helper.setSubject("🔧 Oil Change Reminder — " + vehicle.getVehicleName());
            helper.setText(buildOilChangeEmailHtml(vehicle), true);

            mailSender.send(message);
            log.info("Oil change reminder sent to {} for vehicle '{}'",
                    vehicle.getOwnerEmail(), vehicle.getVehicleName());

        } catch (MessagingException e) {
            log.error("Failed to send oil change reminder to {}: {}", vehicle.getOwnerEmail(), e.getMessage());
            throw new RuntimeException("Email sending failed", e);
        }
    }

    @Async
    public void sendWelcomeEmail(Vehicle vehicle) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(vehicle.getOwnerEmail());
            helper.setSubject("✅ Vehicle Registered — " + vehicle.getVehicleName());
            helper.setText(buildWelcomeEmailHtml(vehicle), true);

            mailSender.send(message);
            log.info("Welcome email sent to {} for vehicle '{}'",
                    vehicle.getOwnerEmail(), vehicle.getVehicleName());

        } catch (MessagingException e) {
            log.error("Failed to send welcome email: {}", e.getMessage());
        }
    }

    private String buildOilChangeEmailHtml(Vehicle vehicle) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
                .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
                .header { background: linear-gradient(135deg, #1a1a2e 0%%, #16213e 50%%, #0f3460 100%%); padding: 40px 32px; text-align: center; }
                .header h1 { color: #f5a623; margin: 0; font-size: 24px; letter-spacing: 1px; }
                .header p { color: #a0aec0; margin: 8px 0 0; font-size: 14px; }
                .body { padding: 32px; }
                .stat-box { background: #fff8f0; border-left: 4px solid #f5a623; border-radius: 8px; padding: 16px 20px; margin: 16px 0; }
                .stat-box .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
                .stat-box .value { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-top: 4px; }
                .cta { display: block; background: #f5a623; color: #1a1a2e; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 24px 0; }
                .footer { background: #f8f9fa; padding: 20px 32px; text-align: center; font-size: 12px; color: #aaa; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔧 Oil Change Due</h1>
                  <p>Time to service your vehicle</p>
                </div>
                <div class="body">
                  <p style="color:#444;">Hi <strong>%s</strong>,</p>
                  <p style="color:#666;">Your <strong>%s</strong> has reached its scheduled oil change interval.</p>
                  <div class="stat-box">
                    <div class="label">Current Odometer</div>
                    <div class="value">%,.0f km</div>
                  </div>
                  <div class="stat-box">
                    <div class="label">Service Due At</div>
                    <div class="value">%,.0f km</div>
                  </div>
                  <p style="color:#666; font-size:14px;">Please visit your nearest service center to get your oil changed. Keeping up with regular maintenance ensures your vehicle runs smoothly and extends its lifespan.</p>
                  <p style="color:#666; font-size:14px;">After your service, log back in to update your odometer reading and schedule your next interval.</p>
                </div>
                <div class="footer">
                  <p>Oil Change Tracker &mdash; Keeping your vehicle healthy</p>
                  <p style="margin-top:4px;">You received this because you registered this vehicle for service reminders.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                vehicle.getOwnerName(),
                vehicle.getVehicleName(),
                vehicle.getCurrentKilometers(),
                vehicle.getNextServiceKilometers()
        );
    }

    private String buildWelcomeEmailHtml(Vehicle vehicle) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
                .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
                .header { background: linear-gradient(135deg, #1a1a2e, #0f3460); padding: 40px 32px; text-align: center; }
                .header h1 { color: #f5a623; margin: 0; font-size: 24px; }
                .body { padding: 32px; }
                .stat-box { background: #f0f9ff; border-left: 4px solid #0f3460; border-radius: 8px; padding: 16px 20px; margin: 12px 0; }
                .stat-box .label { font-size: 12px; color: #888; text-transform: uppercase; }
                .stat-box .value { font-size: 22px; font-weight: 700; color: #1a1a2e; margin-top: 4px; }
                .footer { background: #f8f9fa; padding: 20px 32px; text-align: center; font-size: 12px; color: #aaa; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>✅ Vehicle Registered!</h1>
                </div>
                <div class="body">
                  <p>Hi <strong>%s</strong>, your vehicle has been successfully registered.</p>
                  <div class="stat-box">
                    <div class="label">Vehicle</div>
                    <div class="value">%s</div>
                  </div>
                  <div class="stat-box">
                    <div class="label">Current Odometer</div>
                    <div class="value">%,.0f km</div>
                  </div>
                  <div class="stat-box">
                    <div class="label">Next Service At</div>
                    <div class="value">%,.0f km</div>
                  </div>
                  <p style="color:#666; font-size:14px;">We'll notify you at <strong>%s</strong> when your oil change is due. Remember to keep your odometer reading up to date!</p>
                </div>
                <div class="footer">Oil Change Tracker</div>
              </div>
            </body>
            </html>
            """.formatted(
                vehicle.getOwnerName(),
                vehicle.getVehicleName(),
                vehicle.getCurrentKilometers(),
                vehicle.getNextServiceKilometers(),
                vehicle.getOwnerEmail()
        );
    }
}

