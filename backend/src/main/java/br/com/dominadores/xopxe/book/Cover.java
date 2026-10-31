package br.com.dominadores.xopxe.book;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Imagem de capa enviada pelo admin. O livro guarda só o endereço dela em coverUrl. */
@Entity
@Table(name = "covers")
@Getter
@Setter
@NoArgsConstructor
public class Cover {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "content_type", nullable = false)
	private String contentType;

	@Column(nullable = false)
	private byte[] data;
}
