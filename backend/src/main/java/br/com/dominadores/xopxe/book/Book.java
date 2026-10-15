package br.com.dominadores.xopxe.book;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private String author;

	@Column(nullable = false)
	private String publisher;

	/** Texto livre — o front manda o rótulo escolhido no <select>. */
	@Column(nullable = false)
	private String genre;

	@Column(name = "publication_date", nullable = false)
	private LocalDate publicationDate;

	@Column(nullable = false, columnDefinition = "text")
	private String synopsis;

	/** Só o catálogo usa; o cadastro ainda não envia. */
	@Column(name = "cover_url")
	private String coverUrl;

	@Enumerated(EnumType.STRING)
	@Column(name = "access_type", nullable = false)
	private BookAccessType accessType;

	/** Preenchido só quando accessType é FREE. */
	@Column(name = "pdf_url")
	private String pdfUrl;

	/** Preenchido só quando accessType é PURCHASE. */
	@Column(name = "purchase_url")
	private String purchaseUrl;
}
