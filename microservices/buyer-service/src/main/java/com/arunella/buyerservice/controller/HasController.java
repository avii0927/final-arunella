package com.arunella.buyerservice.controller;

import com.arunella.buyerservice.entity.Has;
import com.arunella.buyerservice.service.HasService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/has")
public class HasController {

    private final HasService hasService;

    public HasController(HasService hasService) {
        this.hasService = hasService;
    }

    @PostMapping
    public ResponseEntity<Has> createHas(@RequestBody Has has) {
        Has saved = hasService.saveHas(has);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Has>> getAllHasLinks() {
        return ResponseEntity.ok(hasService.getAllHasLinks());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Has>> getHasByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(hasService.getHasByOrderId(orderId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Has>> getHasByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(hasService.getHasByProductId(productId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHas(@PathVariable Long id) {
        hasService.deleteHas(id);
        return ResponseEntity.noContent().build();
    }
}
