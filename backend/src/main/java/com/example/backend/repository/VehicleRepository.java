package com.example.backend.repository;

import com.example.backend.enums.NotificationStatus;
import com.example.backend.model.Vehicle;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByOwnerEmail(String ownerEmail);

    @Query("SELECT v FROM Vehicle v WHERE v.currentKilometers >= v.nextServiceKilometers "  + "AND v.notificationStatus = 'PENDING'")
    List<Vehicle> findVehiclesDueForService();

    List<Vehicle> findByNotificationStatus(NotificationStatus status);
}
